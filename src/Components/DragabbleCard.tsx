import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? "#eafcb2" : props.theme.cardColor};
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 10px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : "none"};
`;
interface IDragabbleCardProps {
  toDo: string;
  index: number;
}

function DragabbleCard({ toDo, index }: IDragabbleCardProps) {
  console.log(toDo);
  return (
    <Draggable key={toDo} draggableId={toDo} index={index}>
      {(magic, cardMove) => (
        <Card
          isDragging={cardMove.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
