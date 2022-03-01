import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div<IWrapper>`
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
const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  index: number;
}
interface IForm {
  toDo: string;
}
interface IWrapper {
  isDragging: boolean;
}
function Board({ toDos, boardId, index }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      const saveDate = {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
      localStorage.setItem("toDo", JSON.stringify(saveDate));
      return saveDate;
    });
    setValue("toDo", "");
  };
  const deleteBoard = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setToDos((allBoards) => {
      const toDosBoard = { ...allBoards };
      delete toDosBoard[value];
      localStorage.setItem("toDo", JSON.stringify(toDosBoard));
      return toDosBoard;
    });
  };
  return (
    <Draggable draggableId={boardId} index={index}>
      {(magic, snapshot) => (
        <Wrapper
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          <Title>{boardId}</Title>
          <button value={boardId} onClick={deleteBoard}>
            X
          </button>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`${boardId} 추가하기`}
            />
          </Form>
          <Droppable droppableId={boardId}>
            {(magic, moveInfo) => (
              <Area
                isDraggingOver={moveInfo.isDraggingOver}
                isDraggingFromThis={Boolean(moveInfo.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default Board;
