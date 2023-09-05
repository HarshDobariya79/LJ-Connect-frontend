import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { protectedApi } from '../../services/api';

function Department() {
  const [departmentData, setDepartmentData] = useState();
  const [dataStatus, setDataStatus] = useState('Loading...');
  const [mode, setMode] = useState();
  const [payload, setPayload] = useState({});
  const [message, setMessage] = useState();
  const [branches, setBranches] = useState();
  const [faculties, setFaculties] = useState();
  const [branchChoices, setBranchChoices] = useState();

  useEffect(() => {
    if (['new', 'edit'].includes(mode)) {
      protectedApi
        .get('/api/v1/staff/compact/')
        .then((response) => {
          setFaculties(response?.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(`Faculties fetch error: ${error}`);
        });
    }
  }, [mode]);

  useEffect(() => {
    if (['new', 'edit'].includes(mode)) {
      protectedApi
        .get('/api/v1/branch/compact/')
        .then((response) => {
          const formatedData = response?.data?.map((branch) => {
            return {
              label: `${branch?.branch_code} - ${branch?.branch_short_name}`,
              value: branch?.branch_code,
            };
          });
          setBranches(formatedData);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(`Subject fetch error: ${error}`);
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
      if (payload?.branch) {
        setBranchChoices(
          payload?.branch?.map((branch) => {
            return {
              label: `${branch?.branch_code} - ${branch?.branch_short_name}`,
              value: branch?.branch_code,
            };
          }),
        );
      } else {
        setBranchChoices([]);
      }
    }
  }, mode);

  const resetStates = () => {
    setMode(undefined);
    setBranchChoices(undefined);
    setMessage(undefined);
    setPayload(undefined);
  };

  const fetchDepartmentData = () => {
    const sessionDepartmentData = sessionStorage.getItem('departmentData');
    if (sessionDepartmentData) {
      setDepartmentData(JSON.parse(sessionDepartmentData));
    }

    const abortController = new AbortController();
    protectedApi
      .get('/api/v1/department/', { signal: abortController.signal })
      .then((response) => {
        if (response?.status === 200) {
          console.log(response.data);
          if (response?.data?.length === 0) {
            setDataStatus('No data available');
          }
          setDepartmentData(response?.data);
          resetStates();
          sessionStorage.setItem('departmentData', JSON.stringify(response?.data));
        }
      })
      .catch((error) => {
        setDepartmentData(undefined);
        sessionStorage.removeItem('departmentData');
        setDataStatus('Something went wrong');
        console.error('Fetch department data failed: ', error);
        // logout();
      });
    return abortController;
  };

  useEffect(() => {
    const fetchRequest = fetchDepartmentData();

    return () => fetchRequest.abort();
  }, []);

  const handlePayloadUpdate = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPayload({ ...payload, [name]: value });
  };

  const handleBranchChoices = (selectedValue) => {
    setBranchChoices(selectedValue);
    console.log(selectedValue);
  };

  const sendEditPayload = () => {
    const payloadData = {
      ...payload,
      branch: branchChoices?.map((branch) => branch?.value),
    };
    delete payloadData?.hod_data;
    delete payloadData?.batch;
    setMessage('Updating...');
    protectedApi
      .put('/api/v1/department/', payloadData)
      .then((response) => {
        if (response?.status === 200) {
          console.log('Department object updated', response?.payload?.data);
          fetchDepartmentData();
          //   setMessage("Updated");
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('Department update request failed: ', error);
      });
  };

  const sendNewPayload = () => {
    const payloadData = {
      ...payload,
      branch: branchChoices?.map((branch) => branch?.value),
    };
    delete payloadData?.hod_data;
    delete payloadData?.batch;
    setMessage('Saving...');
    protectedApi
      .post('/api/v1/department/', payloadData)
      .then((response) => {
        if (response?.status === 201) {
          console.log('Department object created', response?.payload?.data);
          fetchDepartmentData();
          //   setMessage("Saved");
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('Department creation request failed: ', error);
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
        <div className="text-2xl text-gray-700 font-medium">Manage Departments</div>
        <div className="flex w-11/12 m-3 ml-5">
          <button
            onClick={() => {
              setPayload({
                year: null,
                semester: null,
                name: null,
                branch: [],
                hod: null,
                locked: false,
              });
              setMode('new');
            }}
            className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded"
            disabled={mode ? true : undefined}
          >
            Create department
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
                        const data = [...departmentData];
                        data.sort((a, b) => a.name.localeCompare(b.name));
                        setDepartmentData(data);
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
                    Year
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...departmentData];
                        data.sort((a, b) => a.year.localeCompare(b.year));
                        setDepartmentData(data);
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
                    Semester
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...departmentData];
                        data.sort((a, b) => a.semester.localeCompare(b.semester));
                        setDepartmentData(data);
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
                    HOD
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...departmentData];
                        data.sort((a, b) => a.hod.localeCompare(b.hod));
                        setDepartmentData(data);
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
                    Locked
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...departmentData];
                        data.sort((a, b) => a.locked - b.locked);
                        setDepartmentData(data);
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
              {departmentData && departmentData?.length > 0 ? (
                departmentData.map((department) => (
                  <tr className="bg-white border-b  ">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{department?.name}</td>
                    <td className="px-6 py-4">{department?.year}</td>
                    <td className="px-6 py-4">{department?.semester}</td>
                    <td className="px-6 py-4">{`${department?.hod_data?.first_name} ${department?.hod_data?.middle_name} ${department?.hod_data?.last_name}`}</td>
                    <td className="px-6 py-4">
                      {department?.locked ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          const data = { ...department };
                          data.id = department?.id;
                          setPayload(data);
                          setMode('edit');
                        }}
                        className="font-medium text-blue-600 px-1 hover:underline"
                        disabled={mode ? true : undefined}
                      >
                        Edit
                      </button>
                      {/* <button onClick={() => {
                            setPayload(department);
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
              {mode === 'new' ? 'New' : 'Edit'} Department
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
                  <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Year
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    className={`${
                      mode === 'edit' ? 'bg-gray-50' : ''
                    } border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    value={payload?.year}
                    onChange={handlePayloadUpdate}
                    required
                    readOnly={mode === 'edit'}
                  />
                </div>
                <div>
                  <label htmlFor="semester" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Semester
                  </label>
                  <input
                    type="text"
                    id="semester"
                    name="semester"
                    className={`${
                      mode === 'edit' ? 'bg-gray-50' : ''
                    } border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    value={payload?.semester}
                    onChange={handlePayloadUpdate}
                    required
                    readOnly={mode === 'edit'}
                  />
                </div>
                <div>
                  <label htmlFor="branch" className="block mb-2 text-sm font-medium text-gray-900">
                    Branch
                  </label>
                  <Select
                    className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full"
                    options={branches}
                    isMulti // Allow multiple selections
                    value={branchChoices}
                    onChange={handleBranchChoices}
                    maxMenuHeight={100}
                    menuPlacement="auto"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="hod" className="block mb-2 text-sm font-medium text-gray-900">
                  HOD
                </label>
                <select
                  name="hod"
                  value={payload?.hod || 'Choose a HOD'}
                  onChange={handlePayloadUpdate}
                  id="hod"
                  className="bg-white border-gray-300 border text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                >
                  <option selected disabled hidden>
                    Choose a HOD
                  </option>
                  {faculties
                    ? faculties.map((hod) => (
                        <option
                          name="hod"
                          onSelect={handlePayloadUpdate}
                          value={hod?.email}
                        >{`${hod?.email} - ${hod?.first_name} ${hod?.middle_name} ${hod?.last_name}`}</option>
                      ))
                    : ''}
                </select>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  id="locked"
                  type="checkbox"
                  value
                  name="locked"
                  onChange={handlePayloadUpdate}
                  checked={payload?.locked === true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                />
                <label htmlFor="locked" className="ml-2 text-sm font-medium text-gray-900">
                  Locked
                </label>
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

export default Department;
