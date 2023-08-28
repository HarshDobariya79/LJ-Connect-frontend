import { useState, useEffect } from "react";
import { protectedApi } from "../../services/api";
import logout from "../../utils/logout";

const Staff = () => {
  const [staffDetails, setStaffDetails] = useState();
  const [dataStatus, setDataStatus] = useState("Loading...");
  const [mode, setMode] = useState(false);
  const [payload, setPayload] = useState({});
  const [message, setMessage] = useState();

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  const updateStaffList = () => {
    protectedApi
      .get("/api/v1/staff/")
      .then((response) => {
        if (response?.status === 200) {
          console.log(response.data);
          if (response?.data?.length == 0) {
            setDataStatus("No data available");
          }
          setStaffDetails(response?.data);
        }
      })
      .catch((error) => {
        setDataStatus("Something went wrong");
        console.error("Fetch staff details failed: ", error);
        // logout();
      });
  };

  useEffect(() => {
    updateStaffList();
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
  };

  const sendEditPayload = () => {
    setMessage("Updating...");
    protectedApi
      .put("/api/v1/staff/", payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Object created", response?.payload?.data);
          updateStaffList();
          setMessage("Updated");
          setTimeout(() => {
            setMessage(undefined);
          }, 2000);
        }
      })
      .catch((error) => {
        setMessage("Failed");
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error("Staff update request failed: ", error);
      });
  };

  const sendNewPayload = () => {
    setMessage("Saving...");
    protectedApi
      .post("/api/v1/staff/", payload)
      .then((response) => {
        if (response?.status === 201) {
          console.log("Object created", response?.payload?.data);
          updateStaffList();
          setMessage("Saved");
          setTimeout(() => {
            setMessage(undefined);
          }, 2000);
        }
      })
      .catch((error) => {
        setMessage("Failed");
        setTimeout(() => {
          setMessage(undefined);
        }, 2000);
        console.error("New staff creation request failed: ", error);
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
        <div className="text-2xl text-gray-700 font-medium">Manage Staff</div>
        <div className="flex w-11/12 m-3 ml-5">
          <button
            onClick={() => {
              setPayload({
                email: "",
                first_name: "",
                last_name: "",
                short_name: "",
                birth_date: "",
                mobile_number: "",
                gender: "M",
                category: "T",
                active: false,
                admin: false,
              });
              setMode("new");
            }}
            className="p-1 px-2 bg-sky-600 hover:bg-oceanic-blue text-white rounded"
          >
            Add staff
          </button>
        </div>

        <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg w-11/12">
          <table className="w-full text-sm text-gray-500 text-center">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200 top-0 sticky">
              <tr>
                <th scope="col" className="py-3 w-auto">
                  <div className="flex items-center justify-center">
                    Email
                    <button
                      onClick={() => {
                        console.log("sorting");
                        let data = [...staffDetails];
                        data.sort((a, b) => a.email.localeCompare(b.email));
                        setStaffDetails(data);
                      }}
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
                        console.log("sorting");
                        let data = [...staffDetails];
                        data.sort((a, b) =>
                          a.first_name.localeCompare(b.first_name)
                        );
                        setStaffDetails(data);
                      }}
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
                    Category
                    <button
                      onClick={() => {
                        console.log("sorting");
                        let data = [...staffDetails];
                        data.sort((a, b) =>
                          a.category.localeCompare(b.category)
                        );
                        setStaffDetails(data);
                      }}
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
                  Mobile no.
                </th>
                <th scope="col" className="py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {staffDetails && staffDetails?.length > 0 ? (
                staffDetails.map((staff) => (
                  <tr className="bg-white border-b  ">
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap text-left"
                    >
                      {staff.email}
                    </td>
                    <td className="px-6 py-4">
                      {`${staff?.first_name} ${staff?.middle_name || ""} ${staff?.last_name}`}
                    </td>
                    <td className="px-6 py-4">{staff.category}</td>
                    <td className="px-6 py-4">{staff.mobile_number}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setPayload(staff);
                          setMode("edit");
                        }}
                        className="font-medium text-blue-600 px-1 hover:underline"
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
      {mode && mode !== "delete" ? (
        <div className="flex flex-col items-center justify-center bg-black bg-opacity-20 w-full h-full absolute top-0 left-0">
          <div className="flex flex-col justify-start w-3/5 max-h-11/12 bg-white rounded-xl">
            <div className="h-16 bg-gray-100 w-full rounded-xl flex justify-center items-center font-bold text-gray-600">
              {mode === "new" ? "New" : "Edit"} Staff Detail
            </div>
            <div className="p-9 overflow-x-auto">
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={payload?.email}
                  onChange={handlePayloadUpdate}
                  {...(mode === "edit" ? { readOnly: true } : {})}
                />
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
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
                  <label
                    htmlFor="middle_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
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
                  <label
                    htmlFor="last_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
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
                  <label
                    htmlFor="short_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Short name
                  </label>
                  <input
                    type="text"
                    id="short_name"
                    name="short_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={payload?.short_name}
                    onChange={handlePayloadUpdate}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="birth_date"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
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
                  <label
                    htmlFor="mobile_number"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
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
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">
                    Gender
                  </label>
                  <div class="flex items-center space-x-2">
                    <input
                      id="male"
                      type="radio"
                      value="M"
                      name="gender"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                      onChange={handlePayloadUpdate}
                      {...(payload?.gender === "M" ? { checked: true } : null)}
                    />
                    <label
                      for="gender"
                      class="ml-2 text-sm font-medium text-gray-900"
                    >
                      Male
                    </label>
                    <input
                      id="female"
                      type="radio"
                      value="F"
                      name="gender"
                      checked={payload?.gender === "F"}
                      onChange={handlePayloadUpdate}
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      for="gender"
                      class="ml-2 text-sm font-medium text-gray-900 "
                    >
                      Female
                    </label>
                    <input
                      id="other"
                      type="radio"
                      value="O"
                      name="gender"
                      checked={payload?.gender === "O"}
                      onChange={handlePayloadUpdate}
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      for="gender"
                      class="ml-2 text-sm font-medium text-gray-900 "
                    >
                      Other
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">
                    Category
                  </label>
                  <div class="flex items-center space-x-2">
                    <input
                      id="teaching"
                      type="radio"
                      value="T"
                      name="category"
                      onChange={handlePayloadUpdate}
                      checked={payload?.category === "T"}
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      for="category"
                      class="ml-2 text-sm font-medium text-gray-900"
                    >
                      Teaching
                    </label>
                    <input
                      id="nonteaching"
                      type="radio"
                      value="NT"
                      name="category"
                      onChange={handlePayloadUpdate}
                      checked={payload?.category === "NT"}
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      for="category"
                      class="ml-2 text-sm font-medium text-gray-900 "
                    >
                      Non-teaching
                    </label>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 mb-2">
                <input
                  id="active"
                  type="checkbox"
                  value={true}
                  name="active"
                  onChange={handlePayloadUpdate}
                  {...(payload?.active === true ? { checked: true } : null)}
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="active"
                  class="ml-2 text-sm font-medium text-gray-900"
                >
                  Active
                </label>
              </div>
              <div class="flex items-center space-x-2 mb-4">
                <input
                  id="admin"
                  type="checkbox"
                  value={true}
                  name="admin"
                  onChange={handlePayloadUpdate}
                  {...(payload?.admin === true ? { checked: true } : null)}
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="admin"
                  class="ml-2 text-sm font-medium text-gray-900"
                >
                  Admin
                </label>
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

export default Staff;
