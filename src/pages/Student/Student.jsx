import React, { useState, useEffect } from 'react';
import { protectedApi } from '../../services/api';
// import logout from '../../utils/logout';

function Student() {
  const [studentDetails, setStudentDetails] = useState();
  const [dataStatus, setDataStatus] = useState('Loading...');
  const [mode, setMode] = useState(false);
  const [payload, setPayload] = useState({});
  const [branches, setBranches] = useState();
  const [message, setMessage] = useState();
  const defaultYear = new Date().getFullYear();

  useEffect(() => {
    if (['new', 'edit'].includes(mode)) {
      protectedApi
        .get('/api/v1/branch/')
        .then((response) => {
          setBranches(response?.data || []);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(`Branch fetch error: ${error}`);
        });
    }
  }, [mode]);

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  const updateStudentList = () => {
    const sessionStudentList = sessionStorage.getItem('studentList');
    console.log(sessionStudentList);
    if (sessionStudentList) {
      setStudentDetails(JSON.parse(sessionStudentList));
    }
    protectedApi
      .get('/api/v1/student/')
      .then((response) => {
        if (response?.status === 200) {
          console.log(response.data);
          if (response?.data?.length === 0) {
            setDataStatus('No data available');
          }
          setStudentDetails(response?.data);
          setMode(undefined);
          setMessage(undefined);
          sessionStorage.setItem('studentList', JSON.stringify(response?.data));
        }
      })
      .catch((error) => {
        setStudentDetails(undefined);
        sessionStorage.removeItem('studentList');
        setDataStatus('Something went wrong');
        console.error('Fetch student details failed: ', error);
        // logout();
      });
  };

  useEffect(() => {
    updateStudentList();
  }, []);

  const handlePayloadUpdate = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPayload({ ...payload, [name]: value });
  };

  const resetStates = () => {
    setMode(undefined);
    setPayload(undefined);
    setMessage(undefined);
  };

  const sendEditPayload = () => {
    console.log('Payload to be sent:', payload);
    setMessage('Updating...');
    protectedApi
      .put('/api/v1/student/', payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log('Object created', response?.payload?.data);
          updateStudentList();
          // setMessage("Updated");
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('Student update request failed: ', error);
        if (error.response) {
          console.error('Server response data:', error.response.data);
        }
      });
  };

  const sendNewPayload = () => {
    console.log('Payload to be sent:', payload);
    setMessage('Saving...');
    protectedApi
      .post('/api/v1/student/', payload)
      .then((response) => {
        if (response?.status === 201) {
          console.log('Object created', response?.payload?.data);
          updateStudentList();
          // setMessage("Saved");
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('New student creation request failed: ', error);
        if (error.response) {
          console.error('Server response data:', error.response.data);
        }
      });
  };

  // const sendDeletePayload = () => {
  //     console.log(mode);
  //     const confirmDelete = confirm("Are you sure you want to delete")
  //     if (confirmDelete) {
  //         console.log('deleting...');
  //         resetStates();
  //     }else{
  //         resetStates();
  //     }
  // };

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
        <div className="text-2xl text-gray-700 font-medium">Manage Student</div>
        <div className="flex w-11/12 m-3 ml-5">
          <button
            onClick={() => {
              setPayload({
                year_joined: defaultYear,
                enrolment_no: '',
                email: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                gender: 'M',
                birth_date: '',
                mobile_number: '',
                branch: '',
                graduated: false,
              });
              setMode('new');
            }}
            className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded"
            disabled={mode ? true : undefined}
          >
            Add student
          </button>
        </div>

        <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg w-11/12">
          <table className="w-full text-sm text-gray-500 text-center">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200 top-0 sticky">
              <tr>
                <th scope="col" className="py-3 w-auto">
                  <div className="flex items-center justify-center">
                    Enrolment No
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...studentDetails];
                        data.sort((a, b) => a.enrolment_no.localeCompare(b.enrolment_no));
                        setStudentDetails(data);
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
                    Email
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...studentDetails];
                        data.sort((a, b) => a.email.localeCompare(b.email));
                        setStudentDetails(data);
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
                    Name
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...studentDetails];
                        data.sort((a, b) => a.first_name.localeCompare(b.first_name));
                        setStudentDetails(data);
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
                    Branch
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...studentDetails];
                        data.sort((a, b) => a.branch.branch_code.localeCompare(b.branch.branch_code));
                        setStudentDetails(data);
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
              {studentDetails && studentDetails?.length > 0 ? (
                studentDetails.map((student) => (
                  <tr className="bg-white border-b  ">
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-left">{student.enrolment_no}</td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-left">{student.email}</td>
                    <td className="px-6 py-4">{`${student?.first_name} ${student?.middle_name || ''} ${student?.last_name}`}</td>
                    <td className="px-6 py-4">{student.branch.branch_short_name}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setPayload(student);
                          setMode('edit');
                        }}
                        className="font-medium text-blue-600 px-1 hover:underline"
                        disabled={mode ? true : undefined}
                      >
                        Edit
                      </button>
                      {/* <button onClick={() => {
                        setPayload(staff);
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
          <div className="flex flex-col justify-start w-3/5 max-h-11/12 bg-white rounded-xl">
            <div className="h-16 bg-gray-100 w-full rounded-xl flex justify-center items-center font-bold text-gray-600">
              {mode === 'new' ? 'New' : 'Edit'} Student Detail
            </div>
            <div className="p-9 overflow-x-auto">
              <div className="mb-6">
                <label htmlFor="enrolment_no" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Enrolment Number
                </label>
                <input
                  type="text"
                  id="enrolment_no"
                  name="enrolment_no"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={payload?.enrolment_no}
                  onChange={handlePayloadUpdate}
                  readOnly={mode === 'edit'}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={payload?.email}
                  onChange={handlePayloadUpdate}
                  readOnly={mode === 'edit'}
                />
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    First name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={payload?.first_name}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="middle_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Middle name
                  </label>
                  <input
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.middle_name}
                    onChange={handlePayloadUpdate}
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.last_name}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="birth_date" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Birth Date<span className="font-normal"> (YYYY-MM-DD)</span>
                  </label>
                  <input
                    type="text"
                    id="birth_date"
                    name="birth_date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.birth_date}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile_number" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Mobile Number
                    <span className="font-normal"> (+91xxxxxxxxxx)</span>
                  </label>
                  <input
                    type="text"
                    id="mobile_number"
                    name="mobile_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.mobile_number}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">Gender</label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="male"
                      type="radio"
                      value="M"
                      name="gender"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                      onChange={handlePayloadUpdate}
                      checked={payload?.gender === 'M'}
                    />
                    <label htmlFor="gender" className="ml-2 text-sm font-medium text-gray-900">
                      Male
                    </label>
                    <input
                      id="female"
                      type="radio"
                      value="F"
                      name="gender"
                      checked={payload?.gender === 'F'}
                      onChange={handlePayloadUpdate}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label htmlFor="gender" className="ml-2 text-sm font-medium text-gray-900 ">
                      Female
                    </label>
                    <input
                      id="other"
                      type="radio"
                      value="O"
                      name="gender"
                      checked={payload?.gender === 'O'}
                      onChange={handlePayloadUpdate}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label htmlFor="gender" className="ml-2 text-sm font-medium text-gray-900 ">
                      Other
                    </label>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="branch" className="block mb-2 text-sm font-medium text-gray-900">
                    Branch
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      name="branch"
                      value={payload?.branch || ''}
                      onChange={handlePayloadUpdate}
                      id="branch"
                      className="bg-gray-50 border-gray-300 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      required
                    >
                      <option value="">Choose a branch</option>
                      {branches && branches.length > 0 ? (
                        branches.map((branch) => (
                          <option
                            key={branch.branch_code}
                            value={branch.branch_code}
                          >{`${branch.branch_code} - ${branch.branch_short_name}`}</option>
                        ))
                      ) : (
                        <option disabled>No branches available</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  id="graduated"
                  type="checkbox"
                  value
                  name="graduated"
                  onChange={handlePayloadUpdate}
                  checked={payload?.graduated === true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                />
                <label htmlFor="graduated" className="ml-2 text-sm font-medium text-gray-900">
                  Graduated
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

export default Student;
