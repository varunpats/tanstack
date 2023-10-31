import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './App.css';

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
]

function App() {
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => wait(1000).then(() => [...POSTS])
  })

  const postMutation = useMutation({
    mutationFn: title => wait(1000).then(() => {
      POSTS.push({ id: POSTS.length + 1, title })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
    }
  })

  if (postQuery.isLoading)
    return <h1>Loading...</h1>

  if (postQuery.isError)
    return <pre>{JSON.stringify(postQuery.error)}</pre>

  return (
    <div>
      <ul>
        {postQuery.data.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <button onClick={() => postMutation.mutate('New Post')}>Add post</button>
    </div>
  );
}

function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

export default App;
