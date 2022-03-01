import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDosState, toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 15px;
  grid-template-columns: repeat(3, 1fr);
`;
const AddBoard = styled.form`
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;
const Input = styled.input`
  background: none;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  text-align: center;
  font-size: 18px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm();
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source, type } = info;
    if (type === "Board") {
      if (!destination) return;
      setToDos((addBoard) => {
        const add = Object.entries(addBoard);
        const [temp] = add.splice(source.index, 1);
        add.splice(destination?.index, 0, temp);
        const resultList = add.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        localStorage.setItem("toDo", JSON.stringify(resultList));
        return resultList;
      });
    } else {
      if (!destination) return;
      if (destination?.droppableId === source.droppableId) {
        setToDos((addBoard) => {
          const add = [...addBoard[source.droppableId]];
          const taskObj = add[source.index];
          add.splice(source.index, 1);
          add.splice(destination?.index, 0, taskObj);
          const resultList = {
            ...addBoard,
            [source.droppableId]: add,
          };
          localStorage.setItem("toDo", JSON.stringify(resultList));
          return resultList;
        });
      }
      if (destination.droppableId !== source.droppableId) {
        setToDos((addBoard) => {
          const sourceBoard = [...addBoard[source.droppableId]];
          const destinationBoard = [...addBoard[destination.droppableId]];
          const taskObj = sourceBoard[source.index];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination?.index, 0, taskObj);
          const resultList = {
            ...addBoard,
            [source.droppableId]: sourceBoard,
            [destination?.droppableId]: destinationBoard,
          };
          localStorage.setItem("toDo", JSON.stringify(resultList));
          return resultList;
        });
      }
    }
  };
  const onSubmit = ({ board }: IToDosState) => {
    setToDos((addBoard) => {
      const add = {
        ...addBoard,
        [board + ""]: [],
      };
      localStorage.setItem("toDo", JSON.stringify(add));
      return add;
    });
    setValue("board", "");
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <AddBoard onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("board", { required: true })}
            type="text"
            placeholder="Add Board!"
          />
        </AddBoard>
        <Wrapper>
          <Droppable droppableId="BOARDS" type={"Board"} direction="horizontal">
            {(magic) => (
              <Boards ref={magic.innerRef} {...magic.droppableProps}>
                {Object.keys(toDos).map((boardId, index) => (
                  <Board
                    boardId={boardId}
                    key={boardId}
                    toDos={toDos[boardId]}
                    index={index}
                  />
                ))}
                {magic.placeholder}
              </Boards>
            )}
          </Droppable>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;

// import React from "react";
// import { useRecoilState, useRecoilValue } from "recoil";
// import {hourSelector, minuteState} from "./atoms"

// function App() {
//   const [mintue, setMintues] = useRecoilState(minuteState);
//   const [hours, setHours] = useRecoilState(hourSelector);
//   const onMinutesChange = (event:React.FormEvent<HTMLInputElement>) => {
//     setMintues(+event.currentTarget.value);
//   };
//   const onHoursChange = (event:React.FormEvent<HTMLInputElement>) => {
//     setHours(+event.currentTarget.value)
//   }
//   return (
//    <>
//    <input value={mintue} onChange={onMinutesChange} placeholder="Minutes" type="number" />
//    <input value={hours} onChange={onHoursChange} placeholder="Hours" type="number" />
//    </>
//   );
// }

// export default App;
