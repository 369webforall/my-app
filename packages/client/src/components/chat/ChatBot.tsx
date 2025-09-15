import { useRef, useState } from 'react';
import ReactMarkdonw from 'react-markdown';
import axios from 'axios';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
  prompt: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};
const ChatBot = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const conversationId = useRef(crypto.randomUUID());
  const [messages, setMessage] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const onSubmit = async ({ prompt }: FormData) => {
    setMessage((prev) => [...prev, { content: prompt, role: 'user' }]);
    setIsBotTyping(true);
    reset();
    const { data } = await axios.post('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });

    setMessage((prev) => [...prev, { content: data.message, role: 'bot' }]);
    setIsBotTyping(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 p-4 bg-orange-200">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
          >
            <ReactMarkdonw>{message.content}</ReactMarkdonw>
          </p>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 p-3 self-start bg-gray-100 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
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
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          className="w-full boarder-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button className="rounded-full w-9 h-9" disabled={!formState.isValid}>
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
