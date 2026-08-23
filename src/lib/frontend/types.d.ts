export interface Toast {
  id: number;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration: number;
}

export type ModalMode = "create" | "update";

export type GoalKey = "calorie" | "weight";

export type ModalCallbacks = {
  onSubmit: () => void | Promise<void>;
  onClose: () => void;
};
