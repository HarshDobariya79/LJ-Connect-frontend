import React, { useState, useEffect } from 'react';
import { protectedApi } from '../../services/api';
import Weightage from './Weightage';
// import logout from '../../utils/logout';

function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [dataStatus, setDataStatus] = useState('Loading...');
  const [mode, setMode] = useState();
  const [payload, setPayload] = useState({});
  const [message, setMessage] = useState();
  const [showWeightageModal, setShowWeightageModal] = useState(false);

  const resetStates = () => {
    setMode(undefined);
    setPayload({});
    setMessage(undefined);
    setShowWeightageModal(false);
  };

  const fetchSubjectData = () => {
    const abortController = new AbortController();
    protectedApi
      .get('/api/v1/subject/', { signal: abortController.signal })
      .then((response) => {
        if (response?.status === 200) {
          if (response?.data?.length === 0) {
            setDataStatus('No data available');
          }
          const subjectsWithWeightage = response.data.map((subject) => {
            return {
              ...subject,
              weightage: subject.weightage || [],
            };
          });
          setSubjects(subjectsWithWeightage);
          console.log(response?.data);
          resetStates();
        }
      })
      .catch((error) => {
        if (error.name === 'CanceledError') {
          console.log('fetchSubjectData request was aborted');
        } else {
          setSubjects([]);
          setDataStatus('Something went wrong');
          console.error('Fetch subject data failed: ', error);
        }
      });
    return abortController;
  };

  useEffect(() => {
    fetchSubjectData();
  }, []);

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  useEffect(() => {
    console.log(showWeightageModal);
  }, [showWeightageModal]);

  useEffect(() => {
    const fetchRequest = fetchSubjectData();

    return () => fetchRequest.abort();
  }, []);

  console.log('Payload before opening Weightage modal:', payload);

  const openWeightageModal = () => {
    setShowWeightageModal(true);
  };

  const handleWeightageSubmission = (weightageId, weightageData) => {
    // If weightageId is provided, it means we are editing an existing weightage
    if (weightageId !== null) {
      // Find the index of the weightage in the existing payload
      const weightageIndex = payload.weightage.findIndex((w) => w.id === weightageId);

      if (weightageIndex !== -1) {
        // Create a new copy of the payload with the edited weightageData
        const updatedPayload = {
          ...payload,
          weightage: [
            ...payload.weightage.slice(0, weightageIndex), // Keep the weightages before the edited one
            { ...payload.weightage[weightageIndex], ...weightageData }, // Update the edited weightage
            ...payload.weightage.slice(weightageIndex + 1), // Keep the weightages after the edited one
          ],
        };

        // Update the state with the new payload
        setPayload(updatedPayload);

        // Log the edited weightageData
        console.log('Edited Weightage Data:', weightageData);
      }
    } else {
      // If weightageId is null, it means we are adding a new weightage
      // Generate a new unique ID for the new weightage (you can use a library like `uuid` for this)

      // Create a new weightage object with the unique ID and the provided weightageData
      const newWeightage = {
        ...weightageData,
      };

      // Create a new copy of the payload with the added newWeightage
      const updatedPayload = {
        ...payload,
        weightage: [...payload.weightage, newWeightage],
      };

      // Update the state with the new payload
      setPayload(updatedPayload);

      // Log the new weightageData
      console.log('New Weightage Data:', weightageData);
    }
  };

  const handlePayloadUpdate = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPayload({ ...payload, [name]: value });
  };

  const sendEditPayload = () => {
    const payloadData = {
      ...payload,
    };

    console.log('Payload to be sent:', payloadData);
    setMessage('Updating...');

    protectedApi
      .put('/api/v1/subject/', payloadData)
      .then((response) => {
        if (response?.status === 200) {
          console.log('Object created', response?.payload?.data);
          fetchSubjectData();
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('Subject update request failed: ', error);
        if (error.response) {
          console.error('Server response data:', error.response.data);
        }
      });
  };

  const sendNewPayload = () => {
    const payloadData = {
      ...payload,
    };
    console.log('Payload to be sent:', payloadData);
    setMessage('Saving...');
    protectedApi
      .post('/api/v1/subject/', payloadData)
      .then((response) => {
        if (response?.status === 201) {
          console.log('Object created', response?.payload?.data);
          fetchSubjectData();
        }
      })
      .catch((error) => {
        setMessage('Failed');
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error('New subject creation request failed: ', error);
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
        <div className="text-2xl text-gray-700 font-medium">Manage Subject</div>
        <div className="flex w-11/12 m-3 ml-5">
          <button
            onClick={() => {
              setPayload({
                subject_code: '',
                subject_short_name: '',
                subject_full_name: '',
                total_credit: 0,
                theory_credit: 0,
                tutorial_credit: 0,
                practical_credit: 0,
                weightage: [],
              });
              setMode('new');
            }}
            className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded"
            disabled={mode ? true : undefined}
          >
            Add Subject
          </button>
        </div>

        <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg w-11/12">
          <table className="w-full text-sm text-gray-500 text-center">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200 top-0 sticky">
              <tr>
                <th scope="col" className="py-3 w-auto">
                  <div className="flex items-center justify-center">
                    Subject Code
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...subjects];
                        data.sort((a, b) => a.subject_code.localeCompare(b.subject_code));
                        setSubjects(data);
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
                    Short Name
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...subjects];
                        data.sort((a, b) => a.subject_short_name.localeCompare(b.subject_short_name));
                        setSubjects(data);
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
                        const data = [...subjects];
                        data.sort((a, b) => a.subject_full_name.localeCompare(b.subject_full_name));
                        setSubjects(data);
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
                    Total Credit
                    <button
                      onClick={() => {
                        console.log('sorting');
                        const data = [...subjects];
                        data.sort((a, b) => a.total_credit - b.total_credit);
                        setSubjects(data);
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
              {subjects && subjects?.length > 0 ? (
                subjects.map((subject) => (
                  <tr className="bg-white border-b text-center ">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{subject.subject_code}</td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{subject.subject_short_name}</td>
                    <td className="px-6 py-4">{subject.subject_full_name}</td>
                    <td className="px-6 py-4">{subject.total_credit}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        // onClick={() => {
                        //   setPayload(subject);
                        //   setMode('edit');
                        // }}
                        className="font-medium text-blue-600 px-1 hover:underline"
                        disabled={mode ? true : undefined}
                      >
                        Edit
                      </button>
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
        <div className="flex flex-col items-center justify-center overflow-y-auto bg-black bg-opacity-20 w-full h-full absolute top-0 left-0">
          <div className="flex flex-col justify-start w-3/5 max-h-full bg-white rounded-xl">
            <div className="h-16 bg-gray-100 w-full rounded-xl flex justify-center items-center font-bold text-gray-600">
              {mode === 'new' ? 'New' : 'Edit'} Subject
            </div>
            <div className="p-8 overflow-x-auto">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="subject_code" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    id="subject_code"
                    name="subject_code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={payload?.subject_code}
                    onChange={handlePayloadUpdate}
                    readOnly={mode === 'edit'}
                  />
                </div>
                <div>
                  <label htmlFor="subject_short_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Short Name
                  </label>
                  <input
                    type="text"
                    id="subject_short_name"
                    name="subject_short_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={payload?.subject_short_name}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject_full_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Name
                  </label>
                  <input
                    type="text"
                    id="subject_full_name"
                    name="subject_full_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={payload?.subject_full_name}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="total_credit" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Total Credit
                  </label>
                  <input
                    type="number"
                    id="total_credit"
                    name="total_credit"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.total_credit}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="theory_credit" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Theory Credit
                  </label>
                  <input
                    type="number"
                    id="theory_credit"
                    name="theory_credit"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.theory_credit}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tutorial_credit" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Tutorial Credit
                  </label>
                  <input
                    type="number"
                    id="tutorial_credit"
                    name="tutorial_credit"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.tutorial_credit}
                    onChange={handlePayloadUpdate}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="practical_credit" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Practical Credit
                  </label>
                  <input
                    type="number"
                    id="practical_credit"
                    name="practical_credit"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.practical_credit}
                    onChange={handlePayloadUpdate}
                  />
                </div>
              </div>

              <div className="my-4">
                <div className="flex w-11/12">
                  <button
                    onClick={openWeightageModal}
                    className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded-lg w-40 h-10 mb-4"
                  >
                    Add Weightage
                  </button>
                </div>

                <Weightage
                  onClose={() => setShowWeightageModal(false)}
                  onWeightageSubmit={handleWeightageSubmission}
                  showModal={showWeightageModal}
                  weightages={payload?.weightage}
                />
              </div>
              <div className="flex justify-start space-x-3 mt-2">
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

export default Subject;
