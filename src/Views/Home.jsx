import React from "react";
import { Tabs } from "antd";

import MealPlans from "../Components/MealPlans";
import WorkoutPlans from "../Components/WorkoutPlans";

const { TabPane } = Tabs;

const Home = () => {
  return (
    <div style={{ margin: 32 }}>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Meal Plans" key="1">
          <MealPlans />
        </TabPane>
        <TabPane tab="Workout Plans" key="2">
          <WorkoutPlans />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Home;
