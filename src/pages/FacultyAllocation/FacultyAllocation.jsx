import { useEffect, useState } from "react";
import { protectedApi } from "../../services/api";

const FacultyAllocation = () => {
  const [facultyAllocationData, setFacultyAllocationData] = useState();
  const [dataStatus, setDataStatus] = useState("Loading...");
  const [mode, setMode] = useState();
  const [payload, setPayload] = useState({});
  const [message, setMessage] = useState();
  const [subjects, setSubjects] = useState();
  const [faculties, setFaculties] = useState();

  useEffect(() => {
    if (["new", "edit"].includes(mode)) {
      protectedApi
        .get("/api/v1/subject/")
        .then((response) => {
          setSubjects(response?.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Subject fetch error: " + error);
        });
    }
  }, [mode]);

  useEffect(() => {
    if (["new", "edit"].includes(mode)) {
      protectedApi
        .get("/api/v1/staff/compact/")
        .then((response) => {
          setFaculties(response?.data);
          console.log(response?.data);
        })
        .catch((error) => {
          console.error("Staff detail fetch error: " + error);
        });
    }
  }, [mode]);

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  const fetFacultyAllocationData = () => {
    protectedApi
      .get("/api/v1/faculty-allocation/")
      .then((response) => {
        if (response?.status === 200) {
          console.log(response.data);
          if (response?.data?.length == 0) {
            setDataStatus("No data available");
          }
          setFacultyAllocationData(response?.data);
          setMode(undefined);
          setMessage(undefined);
        }
      })
      .catch((error) => {
        setDataStatus("Something went wrong");
        console.error("Fetch faculty allocation data failed: ", error);
        // logout();
      });
  };

  useEffect(() => {
    fetFacultyAllocationData();
  }, []);

  const handlePayloadUpdate = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setPayload({ ...payload, [name]: value });
  };

  const resetStates = () => {
    setMode(undefined);
    setPayload(undefined);
    setMessage(undefined);
  };

  const sendEditPayload = () => {
    setMessage("Updating...");
    protectedApi
      .put("/api/v1/faculty-allocation/", payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log(
            "Faculty allocation object created",
            response?.payload?.data
          );
          fetFacultyAllocationData();
          //   setMessage("Updated");
        }
      })
      .catch((error) => {
        setMessage("Failed");
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error("Faculty allocation update request failed: ", error);
      });
  };

  const sendNewPayload = () => {
    setMessage("Saving...");
    protectedApi
      .post("/api/v1/faculty-allocation/", payload)
      .then((response) => {
        if (response?.status === 201) {
          console.log("Object created", response?.payload?.data);
          fetFacultyAllocationData();
          //   setMessage("Saved");
        }
      })
      .catch((error) => {
        setMessage("Failed");
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error("New faculty allocation request failed: ", error);
      });
  };

  const sendPayload = () => {
    switch (mode) {
      case "edit":
        sendEditPayload();
        break;
      case "new":
        sendNewPayload();
        break;
      //   case "delete":
      //     sendDeletePayload();
      //     break;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center max-h-screen p-8">
        <div className="text-2xl text-gray-700 font-medium">
          Manage Faculty Allocation
        </div>
        <div className="flex w-11/12 m-3 ml-5">
          <button
            onClick={() => {
              setPayload({
                id: null,
                faculty: "",
                subject: "",
              });
              setMode("new");
            }}
            className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded"
            {...(mode ? { disabled: true } : "")}
          >
            New allocation
          </button>
        </div>

        <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg w-11/12">
          <table className="w-full text-sm text-gray-500 text-center">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200 top-0 sticky">
              <tr>
                <th scope="col" className="py-3 w-auto">
                  <div className="flex items-center justify-center">
                    Faculty Name
                    <button
                      onClick={() => {
                        console.log("sorting");
                        let data = [...facultyAllocationData];
                        data.sort((a, b) =>
                          a.faculty_first_name.localeCompare(
                            b.faculty_first_name
                          )
                        );
                        setFacultyAllocationData(data);
                      }}
                      {...(mode ? { disabled: true } : "")}
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
                    Faculty short name
                    <button
                      onClick={() => {
                        console.log("sorting");
                        let data = [...facultyAllocationData];
                        data.sort((a, b) =>
                          a.faculty_short_name.localeCompare(
                            b.faculty_short_name
                          )
                        );
                        setFacultyAllocationData(data);
                      }}
                      {...(mode ? { disabled: true } : "")}
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
                    Subject code
                    <button
                      onClick={() => {
                        console.log("sorting");
                        let data = [...facultyAllocationData];
                        data.sort((a, b) => a.subject.localeCompare(b.subject));
                        setFacultyAllocationData(data);
                      }}
                      {...(mode ? { disabled: true } : "")}
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
                    Subject short name
                    <button
                      onClick={() => {
                        console.log("sorting");
                        let data = [...facultyAllocationData];
                        data.sort((a, b) =>
                          a.subject_short_name.localeCompare(
                            b.subject_short_name
                          )
                        );
                        setFacultyAllocationData(data);
                      }}
                      {...(mode ? { disabled: true } : "")}
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
              {facultyAllocationData && facultyAllocationData?.length > 0 ? (
                facultyAllocationData.map((allocation) => (
                  <tr className="bg-white border-b  ">
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >
                      {`${allocation?.faculty_first_name} ${
                        allocation?.faculty_middle_name || ""
                      } ${allocation?.faculty_last_name}`}
                    </td>
                    <td className="px-6 py-4">
                      {allocation?.faculty_short_name}
                    </td>
                    <td className="px-6 py-4">{allocation?.subject}</td>
                    <td className="px-6 py-4">
                      {allocation?.subject_short_name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          const data = { ...allocation };
                          data.id = allocation?.id;
                          setPayload(data);
                          setMode("edit");
                        }}
                        className="font-medium text-blue-600 px-1 hover:underline"
                        {...(mode ? { disabled: true } : "")}
                      >
                        Edit
                      </button>
                      {/* <button onClick={() => {
                            setPayload(allocation);
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
      {mode && mode !== "delete" ? (
        <div className="flex flex-col items-center justify-center bg-black bg-opacity-20 w-full h-full absolute top-0 left-0">
          <div className="flex flex-col justify-start w-1/2 max-h-11/12 bg-white rounded-xl">
            <div className="h-16 bg-gray-100 w-full rounded-xl flex justify-center items-center font-bold text-gray-600">
              {mode === "new" ? "New" : "Edit"} Allocation
            </div>
            <div className="p-9 overflow-x-auto">
              <div className="mb-6">
                <label
                  htmlFor="faculty"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Faculty
                </label>
                <select
                  name="faculty"
                  value={payload?.faculty || "Choose a faculty"}
                  onChange={handlePayloadUpdate}
                  id="faculty"
                  className="bg-gray-50 border-gray-300 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                >
                  <option selected disabled hidden>
                    Choose a faculty
                  </option>
                  {faculties
                    ? faculties.map((faculty) => (
                        <option name="faculty" value={faculty.email}>{`${
                          faculty.first_name
                        } ${faculty.middle_name || ""} ${faculty.last_name} (${
                          faculty.email
                        })`}</option>
                      ))
                    : ""}
                </select>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Subject
                </label>
                <select
                  name="subject"
                  value={payload?.subject || "Choose a subject"}
                  onChange={handlePayloadUpdate}
                  id="subject"
                  className="bg-gray-50 border-gray-300 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                >
                  <option selected disabled hidden>
                    Choose a subject
                  </option>
                  {subjects
                    ? subjects.map((subject) => (
                        <option
                          name="subject"
                          onSelect={handlePayloadUpdate}
                          value={subject.subject_code}
                        >{`${subject.subject_code} - ${subject.subject_short_name}`}</option>
                      ))
                    : ""}
                </select>
              </div>
              <div className="flex justify-start space-x-3">
                <button
                  onClick={sendPayload}
                  className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded text-white font-medium"
                  disabled={message}
                >
                  {message ? message : "save"}
                </button>
                <button
                  onClick={resetStates}
                  className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded text-white font-medium"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default FacultyAllocation;
