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
  background-color: ${(props) => (props.isDragging ? "#dbffcc" : "#70bfe8")};
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
    rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    
`;
const DeleteBoard = styled.div`
  button {
    display: inline-block;
    color: white;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: solid 1px white;
    background-color: transparent;
    font-weight: bold;
    &:hover {
      color: red;
      cursor: pointer;
    }
  }
`;
const Harder = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 10px;
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  font-weight: bold;
  font-size: 35px;
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
  font-weight: bold;
  font-size: 25px;
`;
const Form = styled.form`
  width: 100%;
  input {
    text-indent: 5px;
    margin: 0 5% 0 5%;
    width: 90%;
    outline: none;
    border: none;
    font-size: 15px;
    line-height: 20px;
    border-radius: 5px;
    margin-bottom: 10px;
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
  isDropAnimating: boolean;
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
          isDropAnimating={snapshot.isDropAnimating}
          isDragging={snapshot.isDragging}
        >
          <Harder>
            <Title>{boardId}</Title>
            <DeleteBoard>
              <button value={boardId} onClick={deleteBoard}>
                X
              </button>
            </DeleteBoard>
          </Harder>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`${boardId} 내용 등록하기`}
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
