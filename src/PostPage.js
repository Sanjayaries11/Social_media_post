import React from 'react'
import { Link, useParams } from 'react-router-dom';


const PostPage = ({ posts, handleDelete }) => {
  const { id } = useParams();
  const post = posts.find(post => (post.id).toString() === id);
  return (
    <main className='PostPage'>
        {/* <h1>PostPage!</h1> */}
      <article className='post'>
          {post &&
            <>
              <h2>{post.title}</h2>
              <p className='postDate'>{post.datetime}</p>
              <p className='postBody'>{post.body}</p>
              <Link to={`/edit/ ${post.id}`}>
                <button type='button' className='editButton'>Editpost</button>
              </Link>
              <button type='button' className='deleteButton'
              onClick={()=>handleDelete(post.id)}>
              Delete Post</button>
            </>
          }
          {!post &&
            <>
              <h2>Post Not Found</h2>
              <p>Well that's Disappointing</p>
              <Link to="/"><p>Visit Our Homepage</p></Link>
            </>
          }
      </article>

    </main>
  )
}

export default PostPage;