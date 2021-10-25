import { FormikErrors } from "formik";
import { mutate } from "swr";
import pushService from "./push";
import { IAuthData, IResponse, ITask } from "./typings";
import { errorMap, fetcher, showToast } from "./utils";

export const HOST = `${process.env.API_HOST}/api/v1/`;

export function mutation<T = unknown>(
  endpoint: string,
  method: RequestInit["method"],
  onSuccess?: (data?: T) => void
) {
  return async (
    payload?: unknown,
    cb?: (err?: FormikErrors<typeof payload>, data?: T) => void,
    id?: string
  ) => {
    return fetcher<IResponse<T>>(HOST + endpoint + (id ? `/${id}` : ""), {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      method,
    }).then((res) => {
      if (res.errors) {
        cb?.(errorMap(res.errors));
      } else if (res.data) {
        cb?.(undefined, res.data);
        onSuccess?.(res.data);
      }
    }).catch((e: Error) => {
      cb?.({});
      showToast({
        title: "Network error.",
        description: e.message,
        status: 'error'
      });
    });
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  createUser: mutation("users", "POST", (data) => mutate(HOST + "auth", data)),
  createAuth: mutation<IAuthData>("auth", "POST", (data) => {
    mutate(HOST + "auth", data);
    pushService.subscribe(data!.vapidPublicKey!);
  }),
  deleteAuth: mutation("auth", "DELETE", () => {
    mutate(null);
    pushService.unsubscribe();
  }),
  createPushSubscription: mutation("auth/createPush", "PATCH"),
  deletePushSubscription: mutation("auth/deletePush", "PATCH"),
  createTask: mutation("tasks", "POST", () => mutate("tasks", null)),
  updateTask: mutation<ITask>("tasks", "PATCH", (data) =>
    mutate("tasks", (tasks: ITask[]) =>
      tasks.map((task) => (task.id === data!.id ? data : task))
    )
  ),
};