import axios from "axios";

const safeAsync = async <T>(
  promise: Promise<{ data: T }>,
  fallback: T
): Promise<T> => {
  try {
    const res = await promise;
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Unexpected error:", error);
    }
    return fallback;
  }
};

export default safeAsync;
