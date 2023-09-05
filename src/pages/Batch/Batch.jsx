import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { protectedApi } from '../../services/api';

function Batch() {
  const [batchData, setBatchData] = useState();
  const [dataStatus, setDataStatus] = useState('Loading...');
  const [mode, setMode] = useState();
  const [payload, setPayload] = useState({});
  const [message, setMessage] = useState();
  const [facultyAllocations, setFacultyAllocations] = useState();
  const [departments, setDepartments] = useState();
  const [students, setStudents] = useState();
  const [facultyChoices, setFacultyChoices] = useState();
  const [studentChoices, setStudentChoices] = useState();

  const resetStates = () => {
    setMode(undefined);
    setFacultyChoices(undefined);
    setStudentChoices(undefined);
    setMessage(undefined);
    setPayload(undefined);
  };

  const fetchBatchData = () => {
    const sessionBranchData = sessionStorage.getItem('batchData');
    console.log(sessionBranchData);
    if (sessionBranchData) {
      setBatchData(JSON.parse(sessionBranchData));
    }

    const abortController = new AbortController();
    protectedApi
      .get('/api/v1/batch/', { signal: abortController.signal })
      .then((response) => {
        if (response?.status === 200) {
          console.log(response.data);
          if (response?.data?.length === 0) {
            setDataStatus('No data available');
          }
          setBatchData(response?.data);
          resetStates();
          sessionStorage.setItem('batchData', JSON.stringify(response?.data));
        }
      })
      .catch((error) => {
        if (error.name === 'CanceledError') {
          console.log('fetchBatchData request was aborted');
        } else {
          setBatchData(undefined);
          sessionStorage.removeItem('batchData');
          setDataStatus('Something went wrong');
          console.error('Fetch branch data failed: ', error);
          // logout();
        }
      });
    return abortController;
  };

  useEffect(() => {
    if (['new', 'edit'].includes(mode)) {
      protectedApi
        .get('/api/v1/department/own/')
        .then((response) => {
          setDepartments(response?.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(`Own department fetch error: ${error}`);
        });
    }
  }, [mode]);

  useEffect(() => {
    if (['new', 'edit'].includes(mode)) {
      protectedApi
        .get('/api/v1/faculty-allocation/')
        .then((response) => {
          const formatedData = response?.data?.map((allocation) => {
            return {
              label: `${allocation?.subject_short_name} - ${allocation?.faculty_short_name}`,
              value: allocation?.id,
            };
          });
          setFacultyAllocations(formatedData);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(`Faculty allocation fetch error: ${error}`);
        });
    }
  }, [mode]);

  useEffect(() => {
    if (['new', 'edit'].includes(mode)) {
      protectedApi
        .get('/api/v1/student/compact/')
        .then((response) => {
          const formatedData = response?.data?.map((student) => {
            return {
              label: `${student?.enrolment_no} - ${student?.first_name} ${student?.last_name}`,
              value: student?.enrolment_no,
            };
          });
          setStudents(formatedData);
          console.log(response?.data);
        })
        .catch((error) => {
          console.error(`Student detail fetch error: ${error}`);
        });
    }
  }, [mode]);

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  useEffect(() => {
    if (mode === 'edit') {
      if (payload?.faculty) {
        setFacultyChoices(
          payload?.faculty?.map((allocation) => {
            return {
              label: `${allocation?.subject_short_name} - ${allocation?.faculty_short_name}`,
              value: allocation?.id,
            };
          }),
        );
      } else {
        setFacultyChoices([]);
      }

      if (payload?.student) {
        setStudentChoices(
          payload?.student?.map((student) => {
            return {
              label: `${student?.enrolment_no} - ${student?.first_name} ${student?.last_name}`,
              value: student?.enrolment_no,
            };
          }),
        );
      } else {
        setStudentChoices([]);
      }
    }
  }, mode);

  useEffect(() => {
    const fetchRequest = fetchBatchData();

    return () => fetchRequest.abort();
  }, []);

  useEffect(() => {
    if (studentChoices !== undefined) {
      const payloadData = { ...payload, student: studentChoices?.map((student) => student?.value) };
      setPayload(payloadData);
    }
  }, [studentChoices]);

  useEffect(() => {
    if (facultyChoices !== undefined) {
      const payloadData = { ...payload, faculty: facultyChoices?.map((faculty) => faculty?.value) };
      setPayload(payloadData);
    }
  }, [facultyChoices]);

  const handlePayloadUpdate = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPayload({ ...payload, [name]: value });
  };

  const handleFacultyChoices = (selectedValue) => {
    setFacultyChoices(selectedValue);
    console.log(selectedValue);
  };

  const handleStudentChoices = (selectedValue) => {
    setStudentChoices(selectedValue);
    console.log(selectedValue);
  };

  const sendEditPayload = () => {
    const payloadData = {
      ...payload,
      faculty: facultyChoices?.map((faculty) => faculty?.value),
      student: studentChoices?.map((student) => student?.value),
    };
    delete payloadData.department;
    setMessage('Updating...');
    protectedApi
      .put('/api/v1/batch/', payloadData)
      .then((response) => {
        if (response?.status === 200) {
          console.log('Batch object created', response?.payload?.data);
          fetchBatchData();
          //   setMessage("Updated");
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('Batch update request failed: ', error);
      });
  };

  const sendNewPayload = () => {
    setMessage('Saving...');
    protectedApi
      .post('/api/v1/batch/', payload)
      .then((response) => {
        if (response?.status === 201) {
          console.log('Object created', response?.payload?.data);
          fetchBatchData();
          //   setMessage("Saved");
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('New branch creation request failed: ', error);
      });
  };

  const sendPayload = () => {
    switch (mode) {
      case 'edit':
        sendEditPayload();
        break;
      case 'new':
        sendNewPayload();
        break;
      //   case "delete":
      //     sendDeletePayload();
      //     break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center max-h-screen p-8">
        <div className="text-2xl text-gray-700 font-medium">Manage Batch</div>
        <div className="flex w-11/12 m-3 ml-5">
          <button
            onClick={() => {
              setPayload({
                name: null,
                department: null,
                faculty: [],
                student: [],
              });
              setMode('new');
            }}
            className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded"
            disabled={mode ? true : undefined}
          >
            Create batch
          </button>
        </div>

        <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg w-11/12">
          <table className="w-full text-sm text-gray-500 text-center">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200 top-0 sticky">
              <tr>
                <th scope="col" className="py-3 w-auto">
                  <div className="flex items-center justify-center">
                    Name
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...batchData];
                        data.sort((a, b) => a.name.localeCompare(b.name));
                        setBatchData(data);
                      }}
                      disabled={mode ? true : undefined}
                    >
                      <svg
                        className="w-3 h-3 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="py-3">
                  <div className="flex items-center justify-center">
                    Department year
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...batchData];
                        data.sort((a, b) => a?.department?.year.localeCompare(b?.department?.year));
                        setBatchData(data);
                      }}
                      disabled={mode ? true : undefined}
                    >
                      <svg
                        className="w-3 h-3 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="py-3">
                  <div className="flex items-center justify-center">
                    Semester
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...batchData];
                        data.sort((a, b) => a?.department?.semester.localeCompare(b?.department?.semester));
                        setBatchData(data);
                      }}
                      disabled={mode ? true : undefined}
                    >
                      <svg
                        className="w-3 h-3 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="py-3">
                  <div className="flex items-center justify-center">
                    Department name
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...batchData];
                        data.sort((a, b) => a?.department?.name.localeCompare(b?.department?.name));
                        setBatchData(data);
                      }}
                      disabled={mode ? true : undefined}
                    >
                      <svg
                        className="w-3 h-3 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="py-3 w-auto">
                  <div className="flex items-center justify-center">
                    Faculty count
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...batchData];
                        data.sort((a, b) => a.faculty.length - b.faculty.length);
                        setBatchData(data);
                      }}
                      disabled={mode ? true : undefined}
                    >
                      <svg
                        className="w-3 h-3 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="py-3">
                  <div className="flex items-center justify-center">
                    Student count
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...batchData];
                        data.sort((a, b) => a.student.length - b.student.length);
                        setBatchData(data);
                      }}
                      disabled={mode ? true : undefined}
                    >
                      <svg
                        className="w-3 h-3 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {batchData && batchData?.length > 0 ? (
                batchData.map((branch) => (
                  <tr className="bg-white border-b  ">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{branch?.name}</td>
                    <td className="px-6 py-4">{branch?.department ? branch?.department?.year : 'NA'}</td>
                    <td className="px-6 py-4">{branch?.department ? branch?.department?.semester : 'NA'}</td>
                    <td className="px-6 py-4">{branch?.department ? branch?.department?.name : 'NA'}</td>
                    <td className="px-6 py-4">{branch?.faculty?.length}</td>
                    <td className="px-6 py-4">{branch?.student?.length}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setMode('edit');
                          setPayload(branch);
                        }}
                        className="font-medium text-blue-600 px-1 hover:underline"
                        disabled={mode ? true : undefined}
                      >
                        Edit
                      </button>
                      {/* <button onClick={() => {
                        setPayload(branch);
                        setMode("delete");
                        sendPayload();
                      }} className="font-medium text-red-600 px-1  hover:underline">
                        Remove
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colSpan="5" className="py-4">
                    {dataStatus}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {mode && mode !== 'delete' ? (
        <div className="flex flex-col items-center justify-center bg-black bg-opacity-20 w-full h-full absolute top-0 left-0">
          <div className="flex flex-col justify-start w-1/2 max-h-11/12 bg-white rounded-xl">
            <div className="h-16 bg-gray-100 w-full rounded-xl flex justify-center items-center font-bold text-gray-600">
              {mode === 'new' ? 'New' : 'Edit'} Batch
            </div>
            <div className="p-9 overflow-x-auto">
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`${
                      mode === 'edit' ? 'bg-gray-50' : ''
                    } border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    value={payload?.name}
                    onChange={handlePayloadUpdate}
                    readOnly={mode === 'edit'}
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900">
                    Department
                  </label>
                  <select
                    name="department"
                    value={payload?.department || 'Choose a department'}
                    onChange={handlePayloadUpdate}
                    id="department"
                    className={`${
                      mode === 'edit' ? 'bg-gray-50' : 'bg-white'
                    } border-gray-300 border text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                    required
                    disabled={mode === 'edit'}
                  >
                    <option selected disabled hidden>
                      Choose a department
                    </option>
                    {departments
                      ? departments.map((department) => (
                          <option
                            name="department"
                            onSelect={handlePayloadUpdate}
                            value={department?.id}
                          >{`${department?.year} SEM-${department?.semester} ${department?.name}`}</option>
                        ))
                      : ''}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900">
                  Faculties
                </label>
                <Select
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full"
                  options={facultyAllocations}
                  isMulti // Allow multiple selections
                  value={facultyChoices}
                  onChange={handleFacultyChoices}
                  maxMenuHeight={100}
                  menuPlacement="auto"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900">
                  Students
                </label>
                <Select
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full"
                  options={students}
                  isMulti // Allow multiple selections
                  value={studentChoices}
                  onChange={handleStudentChoices}
                  maxMenuHeight={100}
                  menuPlacement="auto"
                />
              </div>
              <div className="flex justify-start space-x-3">
                <button
                  onClick={sendPayload}
                  className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded text-white font-medium"
                  disabled={message}
                >
                  {message || 'save'}
                </button>
                <button onClick={resetStates} className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded text-white font-medium">
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

export default Batch;
