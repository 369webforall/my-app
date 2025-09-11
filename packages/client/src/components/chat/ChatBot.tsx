import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
  prompt: string;
};
const ChatBot = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(onSubmit)();
        }
      }}
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl m-4"
    >
      <textarea
        {...register('prompt', { required: true })}
        className="w-full boarder-0 focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </form>
  );
};

export default ChatBot;
