import React from "react";
import "./App.css";
import EmployeeSection from "./components/EmployeeSection";
import ShiftSection from "./components/ShiftSection";
import WorkingDaysSection from "./components/WorkingDaysSection";

function App() {
  return (
    <div className="App">
      <ShiftSection />
      <EmployeeSection />
      <WorkingDaysSection />
    </div>
  );
}

export default App;
