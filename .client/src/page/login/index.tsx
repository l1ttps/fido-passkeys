import { useMutation } from "react-query";
import registerPasskeys from "../../service/registerPasskeys";

const Login = () => {
  const publicKey = useMutation({
    mutationFn: (userId: string) => registerPasskeys(userId),
  });

  return (
    <>
      <button
        onClick={() => publicKey.mutate("98e77176-48cf-4f37-8bc9-90990430e54c")}
      >
        register
      </button>
    </>
  );
};

export default Login;
