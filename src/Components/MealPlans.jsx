import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Card, Popconfirm, Upload } from "antd";
import MealPlanService from "../Services/MealPlanService";
import { uploadFile } from "../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";

const MealPlans = () => {
  // State variables
  const [mealPlans, setMealPlans] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMealPlan, setEditingMealPlan] = useState(null);

  // Fetch all meal plans
  useEffect(() => {
    fetchMealPlans();
  }, []);

  // Function to fetch all meal plans
  const fetchMealPlans = async () => {
    try {
      const data = await MealPlanService.getAllMealPlans();
      setMealPlans(data);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
    }
  };

  // Function to handle modal visibility
  const handleModal = () => {
    setVisible(!visible);
  };

  const onEdit = () => {};

  const onDelete = async (id) => {
    try {
      await MealPlanService.deleteMealPlan(id);
      await fetchMealPlans();
    } catch (error) {
      console.error("Error deleting meal plan:", error);
    }
  };

  // Function to handle form submission (create new meal plan)
  const handleCreateMealPlan = async (values) => {
    try {
      // Add photoUrl for each recipe
      const mealPlanWithPhotos = values.meals.map((meal) => ({
        ...meal,
        recipes: meal.recipes.map((recipe) => ({
          ...recipe,
          photoUrl: "", // Placeholder for the photo URL
        })),
      }));

      // Create the meal plan with the updated values
      await MealPlanService.createMealPlan({
        ...values,
        userId: 1,
        meals: mealPlanWithPhotos,
      });

      // Close modal and fetch updated meal plans
      handleModal();
      fetchMealPlans();
      form.resetFields();
    } catch (error) {
      console.error("Error creating meal plan:", error);
    }
  };

  // Function to handle recipe photo upload
  const handleRecipePhotoUpload = async (info, mealIndex, recipeIndex) => {
    if (info.file.status === "done") {
      try {
        // Upload the file and get the URL
        const fileUrl = await uploadFile(info.file.originFileObj);

        // Update the form values with the photo URL
        form.setFieldsValue({
          meals: [
            ...form.getFieldValue("meals").map((meal, i) => {
              if (i === mealIndex) {
                return {
                  ...meal,
                  recipes: meal.recipes.map((recipe, j) => {
                    if (j === recipeIndex) {
                      return {
                        ...recipe,
                        photoUrl: fileUrl,
                      };
                    }
                    return recipe;
                  }),
                };
              }
              return meal;
            }),
          ],
        });
      } catch (error) {
        console.error("Error uploading recipe photo:", error);
      }
    }
  };
  const handleEditMealPlan = (mealPlan) => {
    setEditingMealPlan(mealPlan); // Set the meal plan being edited
    form.setFieldsValue(mealPlan); // Set the form values with the existing values of the meal plan
    handleModal(); // Open the modal
  };
  const handleUpdateMealPlan = async (values) => {
    try {
      // Update the meal plan with the edited values
      await MealPlanService.updateMealPlan({
        ...editingMealPlan,
        ...values,
        meals: values.meals.map((meal) => ({
          ...meal,
          recipes: meal.recipes.map((recipe) => ({
            ...recipe,
            // Preserve existing photo URL if no new photo uploaded
            photoUrl: recipe.photoUrl || "",
          })),
        })),
      });

      // Close modal, reset state, and fetch updated meal plans
      handleModal();
      setEditingMealPlan(null);
      form.resetFields();
      fetchMealPlans();
    } catch (error) {
      console.error("Error updating meal plan:", error);
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <Button onClick={handleModal}>Create Meal Plan</Button>

      {/* Modal for creating new meal plan */}
      <Modal
        title={editingMealPlan ? "Edit Meal Plan" : "Create Meal Plan"}
        visible={visible}
        onCancel={handleModal}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateMealPlan}>
          <Form.Item name="userId" label="User ID">
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.List name="meals">
            {(fields, { add, remove }) => (
              <>
                {fields.map((meal, mealIndex) => (
                  <div key={meal.key}>
                    <Form.Item name={[meal.name, "name"]} label="Meal Name">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[meal.name, "description"]}
                      label="Meal Description"
                    >
                      <Input.TextArea />
                    </Form.Item>
                    <Form.List name={[meal.name, "recipes"]}>
                      {(
                        recipeFields,
                        { add: addRecipe, remove: removeRecipe }
                      ) => (
                        <>
                          {recipeFields.map((recipe, recipeIndex) => (
                            <div key={recipe.key}>
                              <Form.Item
                                name={[recipe.name, "name"]}
                                label="Recipe Name"
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[recipe.name, "ingredients"]}
                                label="Ingredients"
                              >
                                <Input.TextArea />
                              </Form.Item>
                              <Form.Item
                                name={[recipe.name, "cookingInstructions"]}
                                label="Cooking Instructions"
                              >
                                <Input.TextArea />
                              </Form.Item>
                              <Form.Item
                                label="Recipe Photo"
                                name={[recipe.name, "photoUrl"]}
                              >
                                <Upload
                                  listType="picture-card"
                                  onChange={(info) =>
                                    handleRecipePhotoUpload(
                                      info,
                                      mealIndex,
                                      recipeIndex
                                    )
                                  }
                                  showUploadList={false}
                                  beforeUpload={() => false}
                                >
                                  <div>
                                    <UploadOutlined />
                                    <div className="ant-upload-text">
                                      Upload
                                    </div>
                                  </div>
                                </Upload>
                              </Form.Item>
                            </div>
                          ))}
                          <Button
                            onClick={() => addRecipe()}
                            style={{ marginTop: "10px" }}
                          >
                            Add Recipe
                          </Button>
                        </>
                      )}
                    </Form.List>
                    <Popconfirm
                      title="Are you sure you want to remove this meal?"
                      onConfirm={() => remove(meal.name)}
                    >
                      <Button danger style={{ marginTop: "10px" }}>
                        Remove Meal
                      </Button>
                    </Popconfirm>
                  </div>
                ))}
                <Button onClick={() => add()} style={{ marginTop: "10px" }}>
                  Add Meal
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingMealPlan ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Display existing meal plans */}
      <div>
        {mealPlans.map((mealPlan) => (
          <Card
            key={mealPlan.id}
            title={mealPlan.title}
            style={{ marginBottom: "20px" }}
            actions={[
              <Button
                type="primary"
                onClick={() => handleEditMealPlan(mealPlan)}
              >
                Edit
              </Button>,
              <Popconfirm
                title="Are you sure you want to delete this meal plan?"
                onConfirm={() => onDelete(mealPlan.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger">Delete</Button>
              </Popconfirm>,
            ]}
          >
            <p>
              <strong>Description:</strong> {mealPlan.description}
            </p>
            <div>
              <strong>Meals:</strong>
              {mealPlan.meals.map((meal, mealIndex) => (
                <div key={mealIndex}>
                  <p>
                    <strong>Meal Name:</strong> {meal.name}
                  </p>
                  <p>
                    <strong>Meal Description:</strong> {meal.description}
                  </p>
                  <strong>Recipes:</strong>
                  {meal.recipes.map((recipe, recipeIndex) => (
                    <div key={recipeIndex}>
                      <p>
                        <strong>Recipe Name:</strong> {recipe.name}
                      </p>
                      <p>
                        <strong>Ingredients:</strong> {recipe.ingredients}
                      </p>
                      <p>
                        <strong>Cooking Instructions:</strong>{" "}
                        {recipe.cookingInstructions}
                      </p>
                      <img
                        src={recipe.photoUrl}
                        alt="Recipe"
                        style={{ maxWidth: "100%", maxHeight: 400 }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MealPlans;
