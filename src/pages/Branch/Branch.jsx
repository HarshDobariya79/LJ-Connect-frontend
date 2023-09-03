import React, { useEffect, useState } from 'react';
import { protectedApi } from '../../services/api';

function Branch() {
  const [branchData, setBranchData] = useState();
  const [dataStatus, setDataStatus] = useState('Loading...');
  const [mode, setMode] = useState();
  const [payload, setPayload] = useState({});
  const [message, setMessage] = useState();

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  const fetchBranchData = () => {
    const sessionBranchData = sessionStorage.getItem('branchData');
    console.log(sessionBranchData);
    if (sessionBranchData) {
      setBranchData(JSON.parse(sessionBranchData));
    }
    protectedApi
      .get('/api/v1/branch/')
      .then((response) => {
        if (response?.status === 200) {
          console.log(response.data);
          if (response?.data?.length === 0) {
            setDataStatus('No data available');
          }
          setBranchData(response?.data);
          setMode(undefined);
          setMessage(undefined);
          sessionStorage.setItem('branchData', JSON.stringify(response?.data));
        }
      })
      .catch((error) => {
        setBranchData(undefined);
        sessionStorage.removeItem('branchData');
        setDataStatus('Something went wrong');
        console.error('Fetch branch data failed: ', error);
        // logout();
      });
  };

  useEffect(() => {
    fetchBranchData();
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
    setMessage('Updating...');
    protectedApi
      .put('/api/v1/branch/', payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log('Branch object created', response?.payload?.data);
          fetchBranchData();
          //   setMessage("Updated");
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('Branch update request failed: ', error);
      });
  };

  const sendNewPayload = () => {
    setMessage('Saving...');
    protectedApi
      .post('/api/v1/branch/', payload)
      .then((response) => {
        if (response?.status === 201) {
          console.log('Object created', response?.payload?.data);
          fetchBranchData();
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
        <div className="text-2xl text-gray-700 font-medium">Manage Branch</div>
        <div className="flex w-11/12 m-3 ml-5">
          <button
            onClick={() => {
              setPayload({
                branch_code: '',
                branch_short_name: '',
                branch_full_name: '',
                available: true,
              });
              setMode('new');
            }}
            className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded"
            disabled={mode ? true : undefined}
          >
            Add branch
          </button>
        </div>

        <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg w-11/12">
          <table className="w-full text-sm text-gray-500 text-center">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200 top-0 sticky">
              <tr>
                <th scope="col" className="py-3 w-auto">
                  <div className="flex items-center justify-center">
                    Code
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...branchData];
                        data.sort((a, b) => a.branch_code.localeCompare(b.branch_code));
                        setBranchData(data);
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
                        const data = [...branchData];
                        data.sort((a, b) => a.branch_short_name.localeCompare(b.branch_short_name));
                        setBranchData(data);
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
                    Full Name
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...branchData];
                        data.sort((a, b) => a.branch_full_name.localeCompare(b.branch_full_name));
                        setBranchData(data);
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
                    Available
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...branchData];
                        data.sort((a, b) => b.available - a.available);
                        setBranchData(data);
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
              {branchData && branchData?.length > 0 ? (
                branchData.map((branch) => (
                  <tr className="bg-white border-b  ">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{branch?.branch_code}</td>
                    <td className="px-6 py-4">{branch?.branch_short_name}</td>
                    <td className="px-6 py-4">{branch?.branch_full_name}</td>
                    <td className="px-6 py-4">
                      {branch?.available ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setPayload(branch);
                          setMode('edit');
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
              {mode === 'new' ? 'New' : 'Edit'} Branch
            </div>
            <div className="p-9 overflow-x-auto">
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label htmlFor="branch_code" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Branch code
                  </label>
                  <input
                    type="text"
                    id="branch_code"
                    name="branch_code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={payload?.branch_code}
                    onChange={handlePayloadUpdate}
                    readOnly={mode === 'edit'}
                  />
                </div>
                <div>
                  <label htmlFor="branch_short_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Short name
                  </label>
                  <input
                    type="text"
                    id="branch_short_name"
                    name="branch_short_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={payload?.branch_short_name}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="branch_full_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Full name
                </label>
                <input
                  type="text"
                  id="branch_full_name"
                  name="branch_full_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                  value={payload?.branch_full_name}
                  onChange={handlePayloadUpdate}
                />
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  id="available"
                  type="checkbox"
                  value
                  name="available"
                  onChange={handlePayloadUpdate}
                  checked={payload?.available === true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                />
                <label htmlFor="available" className="ml-2 text-sm font-medium text-gray-900">
                  Available
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

export default Branch;
