import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDosState, toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 30px;
  padding: 0 10px;
  grid-template-columns: repeat(3, 1fr);
  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 10px;
  }
`;
const Harder = styled.div`
  width: 100%;
`;

const AddBoard = styled.form`
  width: 100%;
  text-align: center;
`;
const Input = styled.input`
  @media screen and (max-width: 500px) {
    width: 90%;
    margin: 10px auto;
  }
  width: 30%;
  margin-top: 30px;
  margin: 25px 10px;
  background: whitesmoke;
  border-radius: 15px;
  outline: none;
  border: none;
  text-align: center;
  color: black;
  font-size: 20px;
  line-height: 40px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  &:focus {
    border-color: #64b1d9;
  }
  &::placeholder {
    color: black;
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
        const resultList = Object.fromEntries(add);
        localStorage.setItem("toDo", JSON.stringify(resultList));
        return resultList;
      });
    } else {
      if (destination === null) {
        setToDos((addBoard) => {
          const add = [...addBoard[source.droppableId]];
          add.splice(source.index, 1);
          const resultList = {
            ...addBoard,
            [source.droppableId]: add,
          };
          localStorage.setItem("toDo", JSON.stringify(resultList));
          return resultList;
        });
      }
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
        <Harder>
          <AddBoard onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("board", { required: true })}
              type="text"
              placeholder="스티커 추가하기"
            />
          </AddBoard>
        </Harder>
        <Wrapper>
          <Droppable droppableId="BOARDS" type={"Board"} direction="horizontal">
            {(magic, moveInfo) => (
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
