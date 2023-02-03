import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { generateRandomAvatarOptions } from "./avatar";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
import Post from "./Post";
import FlipMove from "react-flip-move";
import Avatar from "avataaars";
import { Button } from "@material-ui/core";

function App() {


  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [reload, shouldReload] = useState(false);
  const reloadEffect = () => shouldReload(!reload);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


  // Initial Metamask Attachment---------------------------------------------------------------
  const [account, setAccount] = useState(null);
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  // Provider loader (Meta mast connector)
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Blogcontract", provider);
      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error("Please install MetaMask!");
      }
    };
    loadProvider();
  }, []);

  // Set meta mast account as a local account to dapp
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  // Initial Metamask Attachment done---------------------------------------------------------- 
  
  
  
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  
  
  // Feeds and Post----------------------------------------------------------------------------
  const [posts, setPosts] = useState([]);
  const getUpdatedBlogs = (allBlogs, address) => {
    // console.log(allBlogs.length)
    let updatedBlogs = [];
    // Here we set a personal flag around the tweets
    for (let i = 0; i < allBlogs.length; i++) {
      if (allBlogs[i].username.toLowerCase() == address.toLowerCase()) {
        let blog = {
          id: allBlogs[i].id,
          blogText: allBlogs[i].blogText,
          isDeleted: allBlogs[i].isDeleted,
          username: allBlogs[i].username,
          personal: true,
        };
        // console.log(blog.blogText)
        updatedBlogs.push(blog);
      } else {
        let blog = {
          id: allBlogs[i].id,
          blogText: allBlogs[i].blogText,
          isDeleted: allBlogs[i].isDeleted,
          username: allBlogs[i].username,
          personal: false,
        };
        updatedBlogs.push(blog);
      }
    }
    updatedBlogs.reverse();
    return updatedBlogs;
  };

  const getAllBlogs = async () => {
    // const { web3, contract } = web3Api;
    try {
      const { contract } = web3Api;
      if (web3Api.web3) {
        let allblogs = await contract.getAllBlogs({
          from: account,
        });
        setPosts(getUpdatedBlogs(allblogs, account));
        reloadEffect();
      } else {
        console.log("Please Connect to Metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // const getAllBlogs = async () => {
    //   // const { web3, contract } = web3Api;
    //   try {
    //     const { contract } = web3Api;
    //     if (web3Api.web3) {
    //       let allblogs = await contract.getAllBlogs({
    //         from: account,
    //       });
    //       setPosts(getUpdatedBlogs(allblogs, account));
    //     } else {
    //       console.log("Please Connect to Metamask");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // reloadEffect();
    getAllBlogs();
  },);

  const deleteBlog = (key) => async () => {
    if (web3Api.web3) {
      // const { web3, contract } = web3Api;
      const { contract } = web3Api;
      await contract.deleteBlogs(key, true);
      let allBlogs = await contract.getAllBlogs({
        from: account,
      });
      setPosts(getUpdatedBlogs(allBlogs, account));
      reloadEffect();
    } else {
      console.log("Please Connect to Metamask");
    }
  };
  
  // Feeds and Post done------------------------------------------------------------------------ 
  
  
  
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  
  
  // Blog Box ---------------------------------------------------------------------------------
  const [BlogMessage, setBlogMessage] = useState("");
  const [avatarOptions, setAvatarOptions] = useState("");

  const addBlog = async () => {
    let blog = {
      blogText: BlogMessage,
      isDeleted: false,
    };
    if (web3Api.web3) {
      const { contract } = web3Api;
      await contract.addBlog(blog.blogText, blog.isDeleted, {
        from: account,
      });
      // reloadEffect();
    } else {
      console.log("Please Connect to Metamask");
    }
  };

  const sendBlog = (e) => {
    e.preventDefault();
    addBlog();
    setBlogMessage("");
  };

  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);
  
  
  
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  
  

  

  return (
    <>
      <div className="app">
        <Sidebar />

        {/* Feed Area !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
        <div className="feed">
          <div className="feed__header">
            <h2>Home</h2>
          </div>

          {/* Blog Box !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
          <div className="blogBox">
            <form>
              <div className="blogBox__input">
                <Avatar
                  style={{ width: "100px", height: "100px" }}
                  avatarStyle="Circle"
                  {...avatarOptions}
                />

                <input
                  onChange={(e) => setBlogMessage(e.target.value)}
                  value={BlogMessage}
                  placeholder="Write your blog!!!?"
                  type="text"
                />
              </div>

              <Button
                onClick={sendBlog}
                type="submit"
                className="blogBox__tweetButton"
              >
                Post
              </Button>
            </form>
          </div>
        {/* Blog Box end !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
          
          <FlipMove>
            {posts.map((post) => (
              <Post
                key={post.id}
                displayName={post.username}
                text={post.blogText}
                personal={post.personal}
                onClick={deleteBlog(post.id)}
              />
            ))}
          </FlipMove>
        </div>

        <Widgets />
      </div>
    </>
  );
}
export default App;
