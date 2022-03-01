import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
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

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((oldToDos) => {
        const boardCopy = [...oldToDos[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...oldToDos,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination?.droppableId]: destinationBoard,
        };
      });
    }
    // setTodos(oldToDos =>{
    //   const toDosCopy = [...oldToDos];
    //   // 1) Delete item on source.index
    //   // console.log("이동시키고 싶은 아이템의 index은", source.index);
    //   // console.log(toDosCopy);
    //   toDosCopy.splice(source.index, 1);
    //   //console.log("삭제후 남은 아이템들");
    //   //console.log(toDosCopy);
    //   // 2) Put back the item on the destination.index
    //   //console.log("움직였던 아이템의 값은", draggableId, "움직인 위치의 index은 ", destination.index);
    //   toDosCopy.splice(destination?.index, 0, draggableId);
    //   //console.log(toDosCopy);
    //   return toDosCopy;
    // })
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
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
