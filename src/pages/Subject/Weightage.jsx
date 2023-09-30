import React, { useState, useEffect } from 'react';

function Weightage({ weightages, onWeightageSubmit, showModal, onClose }) {
  const [teachingType, setTeachingType] = useState('');
  const [category, setCategory] = useState('');
  const [percentageWeightage, setPercentageWeightage] = useState(0);
  const [marksWeightage, setMarksWeightage] = useState(0);
  const [modalVisible, setModalVisible] = useState(showModal);
  const [mode, setMode] = useState('');

  useEffect(() => {
    setModalVisible(showModal);
  }, [showModal]);

  console.log('Weightages in Weightage component:', weightages);

  const resetStates = () => {
    setTeachingType('');
    setCategory('');
    setPercentageWeightage(0);
    setMarksWeightage(0);
    setMode('');
  };

  // ... (previous code)

  const handleSubmit = () => {
    console.log('Adding new weightage...');
    // Create a weightage object with the form data
    const percentageWeightageData = parseInt(percentageWeightage, 10);
    const marksWeightageData = parseInt(marksWeightage, 10);

    const weightageData = {
      teaching_type: teachingType,
      category,
      percentage_weightage: percentageWeightageData,
      marks_weightage: marksWeightageData,
    };

    const closeModal = () => {
      setModalVisible(false);
      onClose();
    };

    onWeightageSubmit(null, weightageData);
    console.log('New weightage data:', weightageData); // Fixed variable name

    resetStates();

    // Close the modal
    closeModal();
  };

  // const handleEdit = (weightage)=>{
  //   setTeachingType(weightage.teaching_type);
  //   setCategory(weightage.category);
  //   setPercentageWeightage(weightage.percentage_weightage);
  //   setMarksWeightage(weightage.marks_weightage);
  //   setModalVisible(true);
  // }

  return (
    <div>
      <table className="w-full text-sm text-gray-500 text-center">
        <thead className="text-xs text-gray-700 uppercase bg-slate-200 top-0 sticky">
          <tr>
            <th scope="col" className="py-3 w-auto">
              <div className="flex items-center justify-center" />
              Teaching Type
            </th>
            <th scope="col" className="py-3 w-auto">
              <div className="flex items-center justify-center">Category</div>
            </th>
            <th scope="col" className="py-3 w-auto">
              <div className="flex items-center justify-center">Percentage Weightage</div>
            </th>
            <th scope="col" className="py-3 w-auto">
              <div className="flex items-center justify-center">Marks Weightage</div>
            </th>
            <th scope="col" className="py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {weightages && weightages?.length > 0 ? (
            weightages.map((weightage) => (
              <tr className="bg-white border-b text-center ">
                <td className="px-6 py-4 font-medium whitespace-nowrap">{weightage.teaching_type}</td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">{weightage.category}</td>
                <td className="px-6 py-4">{weightage.percentage_weightage}</td>
                <td className="px-6 py-4">{weightage.marks_weightage}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    // onClick={() => {
                    //   handleEdit(weightage)
                    // }}
                    className="font-medium text-blue-600 px-1 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan="5" className="py-4" />
            </tr>
          )}
        </tbody>
      </table>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-100 py-4 px-6 font-bold text-gray-600">Add Weightage</div>
            <div className="p-6">
              <form>
                <div className="mb-4">
                  <label htmlFor="teachingType" className="block mb-2 text-sm font-medium text-gray-900">
                    Teaching Type
                  </label>
                  <select
                    id="teachingType"
                    name="teachingType"
                    className="w-full p-2.5 border rounded-lg focus:ring-blue-600 focus:border-blue-600"
                    value={teachingType}
                    onChange={(e) => setTeachingType(e.target.value)}
                    required
                  >
                    <option value="">Select Teaching Type</option>
                    <option value="T">Theory</option>
                    <option value="P">Practical</option>
                    <option value="TU">Tutorial</option>
                  </select>
                </div>

                {/* Dropdown for Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full p-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="MCQ">MCQ</option>
                    <option value="THEORY_DESC">Theory Descriptive</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="percentage_weightage" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Percentage Weightage
                  </label>
                  <input
                    type="number"
                    id="percentage_weightage"
                    name="percentage_weightage"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={percentageWeightage}
                    onChange={(e) => setPercentageWeightage(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="marks_weightage" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Marks Weightage
                  </label>
                  <input
                    type="number"
                    id="marks_weightage"
                    name="marks_weightage"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      "
                    value={marksWeightage}
                    onChange={(e) => setMarksWeightage(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-4 bg-green-500 hover:bg-green-600 px-5 py-2 rounded text-white font-medium"
                  >
                    {mode === 'edit' ? 'Update Weightage' : 'Add Weightage'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalVisible(false);
                      onClose();
                    }}
                    className="mt-4 bg-red-500 hover:bg-red-600 px-5 py-2 rounded text-white font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weightage;
