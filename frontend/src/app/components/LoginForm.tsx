import { useState } from "react";

const LoginForm = ({
  handleLogin,
}: {
  handleLogin: (username: string) => void;
}) => {
  const [username, setUsername] = useState("");

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin(username);
  };

  return (
    <form onSubmit={login}>
      <input
        type="text"
        value={username}
        placeholder="username"
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
