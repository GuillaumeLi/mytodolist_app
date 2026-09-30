import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "./TaskItem";

describe("TaskItem", () => {
    it("displays the task title", () => {
        const task = {
            id: "1",
            title: "Learn React",
            description: "Learn React component testing",
            completed: false
        };
    
        render(
            <TaskItem task={task}
                onDeleteTask={vi.fn()}
                onToggleTaskCompletion={vi.fn()}
                onEditTask={vi.fn()}
            />
        );
    
        expect(screen.getByText("Learn React")).toBeInTheDocument();
    });

    it("calls onToggleTaskCompletion when the checkbox is checked", async () => {
        const user = userEvent.setup();

        const task = {
            id: "1",
            title: "Learn React",
            description: "Learn React component testing",
            completed: false
        };

        const onToggleTaskCompletion = vi.fn();

        render(
            <TaskItem task={task}
                onDeleteTask={vi.fn()}
                onToggleTaskCompletion={onToggleTaskCompletion}
                onEditTask={vi.fn()}
            />
        );

        const checkbox = screen.getByRole("checkbox", { name: "Mark Learn React as complete" });
        await user.click(checkbox);

        expect(onToggleTaskCompletion).toHaveBeenCalledWith("1", true);
    });

    it("expands the task details when clicked", async () => {
        const user = userEvent.setup();
        const task = {
            id: "1",
            title: "Learn React",
            description: "Learn React component testing",
            completed: false
        }

        render(<TaskItem task={task}
            onToggleTaskCompletion={vi.fn()}
            onDeleteTask={vi.fn()}
            onEditTask={vi.fn()}/>);
        
        const expandButton = screen.getByRole("button", { name: "Learn React" });

        expect(expandButton).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByText("Learn React component testing")).not.toBeInTheDocument();

        await user.click(expandButton);

        expect(expandButton).toHaveAttribute("aria-expanded", "true");
        expect(screen.queryByText("Learn React component testing")).toBeInTheDocument();
    });
}); 