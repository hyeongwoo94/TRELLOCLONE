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
const CardMain = styled.div`
  display:flex;
  justify-content: space-between;
  button{
    font-weight: bold;
    border:none;
    background-color: transparent;
    &:hover{
      color: red;
      cursor: pointer;
    }
  }
`;
interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDraggableCardProps) {
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
    <Draggable draggableId={toDoId + ""} key={toDoId} index={index}>
      {(magic, cardMove) => (
        <Card
          isDragging={cardMove.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <CardMain>
          {toDoText}
          <button value={toDoId} onClick={onDeleteClick}>
            삭제
          </button>
          </CardMain>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
