"use client";

import { Comment } from "@/lib/schema";
import { formatDateTime } from "@/lib/utils";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MessageSquare, Check } from "lucide-react";
import { useState } from "react";

interface CommentDrawerProps {
  comments: Comment[];
  onAddComment: (content: string, sectionId: string) => void;
  onResolveComment: (commentId: string) => void;
  currentSectionId?: string;
}

export function CommentDrawer({
  comments,
  onAddComment,
  onResolveComment,
  currentSectionId,
}: CommentDrawerProps) {
  const [newComment, setNewComment] = useState("");

  const sectionComments = currentSectionId
    ? comments.filter((c) => c.sectionId === currentSectionId)
    : comments;

  const handleAddComment = () => {
    if (!newComment.trim() || !currentSectionId) return;
    onAddComment(newComment, currentSectionId);
    setNewComment("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Comments
        </h3>
        {currentSectionId && (
          <p className="text-sm text-muted-foreground mt-1">
            {sectionComments.length} comment(s) on this section
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sectionComments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No comments yet
          </div>
        ) : (
          sectionComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border ${
                comment.resolved ? "bg-muted/50" : "bg-background"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-medium text-sm">{comment.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateTime(comment.timestamp)}
                  </div>
                </div>
                {!comment.resolved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResolveComment(comment.id)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-sm">{comment.content}</p>
              {comment.resolved && (
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Resolved
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {currentSectionId && (
        <div className="p-4 border-t space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button onClick={handleAddComment} className="w-full">
            Add Comment
          </Button>
        </div>
      )}
    </div>
  );
}

