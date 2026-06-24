import {
  CreateCommentApi,
  GetCommentChildApi,
  GetCommentRootApi,
  ReplyCommentApi,
  AcceptCommentApi,
} from '@/services/api/comment.api'
import type {
  Comment,
  CommentResp,
  CreateComment,
  ReplyComment,
} from '@/types/comment.type'
import type { Pagination } from '@/types/common/pagination'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommentStore = defineStore('Comment', () => {
  const commentSelected = ref<Comment>()
  const comment = ref<CommentResp>()
  const postComment = ref<CommentResp[]>()
  const pagination = ref<Pagination>()
  const replyCommentData = ref<CommentResp[]>()
  const replyPagination = ref<Pagination>()

  const createComment = async (dto: CreateComment): Promise<boolean> => {
    const resp = await CreateCommentApi(dto)
    if (resp) {
      const newComment: CommentResp = {
        comment: resp,
        likes: 0,
        replies: 0,
      }

      postComment.value = postComment.value || []
      postComment.value.push(newComment)

      return true
    }
    return false
  }
  const replyComment = async (dto: ReplyComment): Promise<boolean> => {
    const resp = await ReplyCommentApi(dto)
    if (resp) {
      const newComment: CommentResp = {
        comment: resp,
        likes: 0,
        replies: 0,
      }

      postComment.value = postComment.value || []
      postComment.value.push(newComment)

      return true
    }
    return false
  }

  const getReplyComment = async (parentCommentId: string): Promise<boolean> => {
    
    const resp = await GetCommentChildApi(parentCommentId)
    if (resp) {
      replyCommentData.value = resp.comments

      replyPagination.value = resp.pagination
      return true
    }
    return false
  }
  const getComment = async (id: string): Promise<boolean> => {
    const resp = await GetCommentRootApi(id)
    if (resp) {
      postComment.value = resp.comments
      pagination.value = resp.pagination
      return true
    }
    return false
  }
  const selectComment = (comment: Comment) => {
    commentSelected.value = comment
    console.log('selectComment')
  }

  const acceptComment = async (commentId: string, userId: string): Promise<boolean> => {
    const resp = await AcceptCommentApi(commentId, userId)
    if (resp) {
      if (postComment.value) {
        postComment.value = postComment.value.map(c => {
          if (c.comment._id === commentId) {
            return {
              ...c,
              comment: {
                ...c.comment,
                isAccepted: resp.isAccepted
              }
            }
          } else {
            return {
              ...c,
              comment: {
                ...c.comment,
                isAccepted: false
              }
            }
          }
        })
      }
      if (replyCommentData.value) {
        replyCommentData.value = replyCommentData.value.map(c => {
          if (c.comment._id === commentId) {
            return {
              ...c,
              comment: {
                ...c.comment,
                isAccepted: resp.isAccepted
              }
            }
          } else {
            return {
              ...c,
              comment: {
                ...c.comment,
                isAccepted: false
              }
            }
          }
        })
      }
      return true
    }
    return false
  }

  return {
    comment,
    createComment,
    replyComment,
    getComment,
    postComment,
    pagination,
    selectComment,
    commentSelected,
    getReplyComment,
    replyCommentData,
    replyPagination,
    acceptComment,
  }
})
