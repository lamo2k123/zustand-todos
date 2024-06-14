import React, { useState } from "react";
import { useUpdateTodoMutation, useDeleteTodoMutation } from "../api/todoApi";
import { useTodoStore } from "../store/useTodoStore";
import styles from "./styles.module.css";

interface TodoItemProps {
	todo: { userId: number; id: number; title: string; completed: boolean };
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(todo.title);

	const [updateTodo, { isLoading: isTodoUpdateing }] = useUpdateTodoMutation();
	const [deleteTodo, { isLoading: isTodoDeleting }] = useDeleteTodoMutation();
	const { deleteTodo: deleteFromStore, updateTodo: updateInStore } = useTodoStore();

	const isTodoDisable = isTodoUpdateing || isTodoDeleting;

	const handleSave = async () => {
		await updateTodo({
			id: todo.id,
			title: newTitle,
			completed: todo.completed,
			userId: todo.userId,
		});
		updateInStore(todo.id, { title: newTitle });
		setIsEditing(false);
	};

	const handleDelete = async () => {
		await deleteTodo(todo.id);
		deleteFromStore(todo.id);
	};

	return (
		<div className={styles.todoItem}>
			{isEditing ? (
				<>
					<input
						type="text"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						disabled={isTodoDisable}
					/>
					<button onClick={handleSave} disabled={isTodoDisable}>
						Save
					</button>
				</>
			) : (
				<>
					<span
						style={{
							textDecoration: todo.completed ? "line-through" : "none",
						}}
					>
						{todo.title}
					</span>
					<button onClick={() => setIsEditing(true)} disabled={isTodoDisable}>
						Редактировать
					</button>
					<button onClick={handleDelete} disabled={isTodoDisable}>
						Удалить
					</button>
					<button
						onClick={() => updateInStore(todo.id, { completed: !todo.completed })}
						disabled={isTodoDisable}
					>
						{todo.completed ? "Не выполнено" : "Выполнено"}
					</button>
				</>
			)}
		</div>
	);
};
