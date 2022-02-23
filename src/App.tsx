import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDostate } from "./atoms";

const Wrapper = styled.div`
display: flex;
max-width: 480px;
width: 100%;
margin: 0 auto;
justify-content: center;
align-items: center;
height: 100vh;
`;
const Boards = styled.div`
display: grid;
width: 100%;
grid-template-columns: repeat(3, 1fr);
`;
const Board =styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding: 10px 10px;
  border-radius: 5px;
  min-height: 200px;
`;
const Card =styled.div`
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 10px;
`;
function App() {
  const[toDos, setTodos] = useRecoilState(toDostate);
  const onDragEnd = ({draggableId, destination, source}:DropResult) => {
    if(!destination) return
    setTodos(oldToDos =>{
      const toDosCopy = [...oldToDos];
      // 1) Delete item on source.index
      console.log("이동시키고 싶은 아이템의 index은", source.index);
      console.log(toDosCopy);
      toDosCopy.splice(source.index, 1);
      console.log("삭제후 남은 아이템들");
      console.log(toDosCopy);
      // 2) Put back the item on the destination.index
      console.log("움직였던 아이템의 값은", draggableId, "움직인 위치의 index은 ", destination.index);
      toDosCopy.splice(destination?.index, 0, draggableId);
      console.log(toDosCopy);
      return toDosCopy;
    })
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
          <Droppable droppableId="one">
            {(magic) => (
              <Board ref={magic.innerRef} {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                <Draggable key={toDo} draggableId={toDo} index={index}>
                  {(magic) => (
                    <Card
                      ref={magic.innerRef} {...magic.dragHandleProps} {...magic.draggableProps}>
                      {toDo}
                    </Card>
                  )}
                </Draggable>
                ))}
                 {magic.placeholder}
              </Board>
            )}
          </Droppable>
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
