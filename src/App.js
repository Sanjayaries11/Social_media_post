import './index.css';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import Nav from "./Nav";
import Home from "./Home";
import About from "./About";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Missing from "./Missing";
import Footer from "./Footer";
import Post from "./Post";
import PostLayout from "./PostLayout";
import { format } from "date-fns"
import api from "./api/posts"
import EditPosts from './EditPosts';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';

function App() {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([
    // {
    //   id:1,
    //   title:"My First Post",
    //   datetime:"July 01,2021 11:00:00 AM",
    //   body:"Made a video of HTML"
    // },
    // {
    //   id:2,
    //   title:"My Second Post",
    //   datetime:"August 02,2021 12:00:00 PM",
    //   body:"Made a video of CSS"
    // },
    // {
    //   id:3,
    //   title:"My Third Post",
    //   datetime:"September 03,2021 13:00:00 PM",
    //   body:"Made a video of Javascript"
    // },
    // {
    //   id:4,
    //   title:"My Fourth Post",
    //   datetime:"October 04,2021 14:00:00 PM",
    //   body:"Made a video of Bootstrap"
    // }
  ])
  const [searchResults, setSearchResults] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch("http://localhost:3000/posts");



  //for axios topic
  // useEffect(()=>{
  //   const fetchPosts = async()=>{
  //     try{
  //       const response = await api.get('/posts');
  //       setPosts(response.data)
  //     }
  //     catch(err){
  //       if(err.message){
  //         console.log(err.response.data)
  //         console.log(err.response.status)
  //         console.log(err.response.headers)
  //       }else{
  //         console.log(`Error: ${err.message}`);
  //       }
  //     }
  //   }
  //   fetchPosts();
  // },[])



  //for axiosFetch topic
  useEffect(() => {
    setPosts(data);
  }, [data]);


  useEffect(() => {
    const filteredResults = posts.filter((post) => ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase()));

    setSearchResults(filteredResults.reverse());
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post('/posts', newPost)
      const allPost = [...posts, response.data]
      setPosts(allPost)
      setPostTitle('');
      setPostBody('');
      navigate('/ ')
    }
    catch (err) {
      console.log(`Error:${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`posts/${id}`)
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      navigate('/ ')
    }
    catch (err) {
      console.log(`Error: ${err.message}`)
    }
  }


  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost)
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('')
      setEditBody('')
      navigate('/')
    }
    catch (err) {
      console.log(`Error:${err.message}`);
    }
  }
  return (
    <div className="App">
      {/* <nav> 
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/postpage">PostPage</Link></li>
        </ul>
      </nav> */}

      {/* <Routes>
         <Route path="/" element={<Home />} />
         <Route path="about" element={<About />} />
         <Route path="/postpage" element={<PostLayout />}>
          <Route index element={<PostPage />} />
          <Route path=":id" element={<Post />} />
          <Route path="newpost" element={<NewPost />} />
        </Route>
         <Route path="*" element={<Missing />} /> 
       </Routes> */}


      <Header title="Social Media App" width={width} />
      <Nav
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path='/' element={
          <Home
            posts={searchResults}
            fetchError={fetchError}
            isLoading={isLoading}
          />} />

        <Route path='post'>
          <Route index element={<NewPost
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
            handleSubmit={handleSubmit}
          />} />
          <Route path=":id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
          {/* <PostPage /> */}
        </Route>

        <Route path="/edit/:id" element={<EditPosts
          posts={posts}
          handleEdit={handleEdit}
          editBody={editBody}
          setEditBody={setEditBody}
          editTitle={editTitle}
          setEditTitle={setEditTitle} />} />

        <Route path='about' element={<About />} />
        <Route path='*' element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
