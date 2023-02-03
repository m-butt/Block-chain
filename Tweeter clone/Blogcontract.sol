// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Blogcontract {

    event AddBlog(address recipient, uint blogId);
    event DeleteBlog(uint blogId, bool isDeleted);

    struct Blog {
        uint id;
        address username;
        string blogText;
        bool isDeleted;
    }

    Blog[] private blogs;

    // Mapping of Blog id to the wallet address of the user
    mapping(uint256 => address) blogToOwner;

    // Method to be called by our frontend when trying to add a new Blog
    function addBlog(string memory blogText, bool isDeleted) external {
        uint blogId = blogs.length;
        blogs.push(Blog(blogId, msg.sender, blogText, isDeleted));
        blogToOwner[blogId] = msg.sender;
        emit AddBlog(msg.sender, blogId);
    }

    // Method to get all the Tweets
    function getAllBlogs() external view returns (Blog[] memory) {
        Blog[] memory temporary = new Blog[](blogs.length);
        uint counter = 0;
        for(uint i=0; i<blogs.length; i++) {
            if(blogs[i].isDeleted == false) {
                temporary[counter] = blogs[i];
                counter++;
            }
        }

        Blog[] memory result = new Blog[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to get only your Tweets
    function getMyBlogs() external view returns (Blog[] memory) {
        Blog[] memory temporary = new Blog[](blogs.length);
        uint counter = 0;
        for(uint i=0; i<blogs.length; i++) {
            if(blogToOwner[i] == msg.sender && blogs[i].isDeleted == false) {
                temporary[counter] = blogs[i];
                counter++;
            }
        }

        Blog[] memory result = new Blog[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to Delete a Tweet
    function deleteBlogs(uint blogId, bool isDeleted) external {
        if(blogToOwner[blogId] == msg.sender) {
            blogs[blogId].isDeleted = isDeleted;
            emit DeleteBlog(blogId, isDeleted);
        }
    }

}