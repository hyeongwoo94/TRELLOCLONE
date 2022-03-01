import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

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
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { value },
    } = event;
    const id = value;
    setToDos((toDo) => {
      const toDoCopy = { ...toDo };
      const keys = Object.keys(toDoCopy);
      keys.forEach((key) => {
        toDoCopy[key] = toDo[key].filter(
          (toDoCard) => toDoCard.id !== parseInt(id)
        );
      });
      localStorage.setItem("toDo", JSON.stringify(toDoCopy));
      return toDoCopy;
    });
  };
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, cardMove) => (
        <Card
          isDragging={cardMove.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
          <button value={toDoId} onClick={onDeleteClick}>
            X
          </button>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
