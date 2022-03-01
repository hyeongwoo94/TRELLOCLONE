import { atom, selector } from "recoil";
export interface ITodo{
  id:number;
  text:string;
}

interface IToSosState{
  [key: string] : ITodo[]
}
const localTodo = localStorage.getItem("todo");
const todoJSON = JSON.parse(localTodo as any);

export const toDoState = atom<IToSosState>({
  key:"toDo",
  default: todoJSON || {
    "TO DO": [],
    Doing: [],
    Done: [],
  },
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