import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  InputNumber,
  Popconfirm,
  Card,
} from "antd";
import WorkoutPlanService from "../Services/WorkoutPlanService";
import {
  MinusCircleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const WorkoutPlans = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const workoutPlansData = await WorkoutPlanService.getAllWorkoutPlans();
      setWorkoutPlans(workoutPlansData);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await WorkoutPlanService.deleteWorkoutPlan(id);
      await fetchWorkoutPlans();
      message.success("Workout plan deleted successfully");
    } catch (error) {
      console.error("Error deleting workout plan:", error);
    }
  };

  const handleAdd = () => {
    setVisible(true);
  };

  const handleEdit = (workoutPlan) => {
    setSelectedWorkoutPlan(workoutPlan);
    form.setFieldsValue(workoutPlan);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedWorkoutPlan) {
        await WorkoutPlanService.updateWorkoutPlan(
          selectedWorkoutPlan.id,
          values
        );
        message.success("Workout plan updated successfully");
      } else {
        await WorkoutPlanService.createWorkoutPlan({ ...values, userId: 1 });
        message.success("Workout plan created successfully");
      }
      setVisible(false);
      form.resetFields();
      fetchWorkoutPlans();
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setSelectedWorkoutPlan(null);
  };

  return (
    <div>
      <Button style={{ marginBottom: 16 }} onClick={handleAdd}>
        Add Workout Plan
      </Button>
      <Modal
        title={selectedWorkoutPlan ? "Edit Workout Plan" : "Add Workout Plan"}
        visible={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea />
          </Form.Item>

          {/* Add fields for routines */}
          <Form.List name="routines">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      fieldKey={[fieldKey, "name"]}
                      label="Routine Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter routine name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.List name={[name, "exercises"]}>
                      {(
                        exercisesFields,
                        { add: addExercise, remove: removeExercise }
                      ) => (
                        <>
                          {exercisesFields.map(
                            ({
                              key: exerciseKey,
                              name: exerciseName,
                              fieldKey: exerciseFieldKey,
                              ...exerciseRestField
                            }) => (
                              <Space
                                key={exerciseKey}
                                style={{ display: "flex", marginBottom: 8 }}
                                align="baseline"
                              >
                                <Form.Item
                                  {...exerciseRestField}
                                  name={[exerciseName, "name"]}
                                  fieldKey={[exerciseFieldKey, "name"]}
                                  label="Exercise Name"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter exercise name",
                                    },
                                  ]}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  {...exerciseRestField}
                                  name={[exerciseName, "sets"]}
                                  fieldKey={[exerciseFieldKey, "sets"]}
                                  label="Sets"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter number of sets",
                                    },
                                  ]}
                                >
                                  <InputNumber min={1} />
                                </Form.Item>
                                <Form.Item
                                  {...exerciseRestField}
                                  name={[exerciseName, "repetitions"]}
                                  fieldKey={[exerciseFieldKey, "repetitions"]}
                                  label="Repetitions"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please enter number of repetitions",
                                    },
                                  ]}
                                >
                                  <InputNumber min={1} />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => removeExercise(exerciseName)}
                                />
                              </Space>
                            )
                          )}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addExercise()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Exercise
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Routine
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          {/* Add createdAt and lastUpdatedAt fields */}
          <Form.Item name="createdAt" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item name="lastUpdatedAt" style={{ display: "none" }}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Render the list of workout plans */}
      <div>
        {workoutPlans.map((workoutPlan) => (
          <Card
            key={workoutPlan.id}
            title={workoutPlan.title}
            extra={
              <Space>
                <Button type="primary" onClick={() => handleEdit(workoutPlan)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this workout plan?"
                  onConfirm={() => handleDelete(workoutPlan.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger">Delete</Button>
                </Popconfirm>
              </Space>
            }
          >
            <p>
              <strong>Description:</strong> {workoutPlan.description}
            </p>

            <p>
              <strong>Routines:</strong>
            </p>
            <ul>
              {workoutPlan.routines.map((routine, index) => (
                <li key={index}>
                  <strong>Routine {index + 1}:</strong> {routine.name}
                  <ul>
                    {routine.exercises.map((exercise, exerciseIndex) => (
                      <li key={exerciseIndex}>
                        <strong>Exercise {exerciseIndex + 1}:</strong>{" "}
                        {exercise.name}, Sets: {exercise.sets}, Repetitions:{" "}
                        {exercise.repetitions}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlans;
