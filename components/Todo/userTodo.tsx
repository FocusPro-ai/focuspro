import React from "react";

const UserTodoComponent = ({ data }: any) => {
  return (
    <div
      className={`border-2 ${data.importance > 8 && " border-red-500"} ${
        data.importance <= 7 && "border-violet-600"
      } ${
        data.importance < 4 && "border-gray-600"
      } cursor-pointer rounded-md p-2 `}
    >
      <h1>{data.heading}</h1>
    </div>
  );
};

export default UserTodoComponent;
