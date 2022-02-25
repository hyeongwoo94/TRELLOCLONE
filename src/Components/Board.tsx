import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 12px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  text-align: center;
  font-weight: bold;
  margin: 10px 0 0 0;
`;
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#f5edb0"
      : props.isDraggingFromThis
      ? "#64b1d9"
      : "#70bfe8"};
  flex-grow: 1;
  padding: 12px;
  transition: background-color 0.3s ease-in-out;
  border-radius: 0 0 12px 12px;
`;
interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
interface IBoardProps {
  toDos: string[];
  boardId: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Droppable droppableId={boardId}>
        {(magic, moveInfo) => (
          <Area
            isDraggingOver={moveInfo.isDraggingOver}
            isDraggingFromThis={Boolean(moveInfo.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard key={toDo} index={index} toDo={toDo} />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
