import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  console.log(comment._id);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = async () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt=""
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold text-xs mr-1 truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              placeholder="Add a comment..."
              rows={"3"}
              maxLength={"200"}
              onChange={(e) => setEditContent(e.target.value)}
              value={editContent}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                gradientDuoTone={"greenToBlue"}
                type="button"
                size={"sm"}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                gradientDuoTone={"pinkToOrange"}
                size={"sm"}
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 border-t text-xs dark:border-gray-700 max-w-fit gap-2">
              <button
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "Like" : "Likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      className="text-gray-400 hover:text-blue-500"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
