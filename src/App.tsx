import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {hourSelector, minuteState} from "./atoms"

function App() {
  const [mintue, setMintues] = useRecoilState(minuteState);
  const [hours, setHours] = useRecoilState(hourSelector);
  const onMinutesChange = (event:React.FormEvent<HTMLInputElement>) => {
    setMintues(+event.currentTarget.value);
  };
  const onHoursChange = (event:React.FormEvent<HTMLInputElement>) => {
    setHours(+event.currentTarget.value)
  }
  return (
   <>
   <input value={mintue} onChange={onMinutesChange} placeholder="Minutes" type="number" />
   <input value={hours} onChange={onHoursChange} placeholder="Hours" type="number" />
   </>
  );
}

export default App;
