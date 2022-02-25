import { atom, selector } from "recoil";

interface IToSosState{
  [key: string] : string[]
}

export const toDoState = atom<IToSosState>({
  key:"toDo",
  default: {
    ToDo:["첫번째",  "네번째","다섯번째",],
    Doing:["두번째", "세번째",],
    Done:[ "여섯번째"]
  }
})





























// import { atom, selector } from "recoil";

// export const minuteState = atom({
//   key:"minutes",
//   default: 0
// })

// export const hourSelector = selector<number>({
//   key:"hours",
//   get: ({get})=>{
//     const minutes = get(minuteState);
//     return minutes / 60;
//   },
//   set: ({set}, newValue) =>{
//     const minutes = Number(newValue) * 60;
//     set(minuteState, minutes);
//   }
// })