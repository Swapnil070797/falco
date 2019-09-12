import { AnyAction } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import {
  addMemberToProjectSuccess,
  deleteMemberOfProjectSuccess,
  editMemberOfProjectSuccess,
  fetchProjectError,
  fetchProjectsRequest,
  fetchProjectSuccess,
  setProjectToastrDisplay
} from './actions';
import { ProjectMember, ProjectToastrDisplayType, ProjectType } from './types';

export type ProjectsAction = ActionType<
  typeof fetchProjectsRequest |
  typeof addMemberToProjectSuccess |
  typeof deleteMemberOfProjectSuccess |
  typeof editMemberOfProjectSuccess |
  typeof fetchProjectSuccess | 
  typeof fetchProjectError |
  typeof setProjectToastrDisplay
>;

export type ProjectsState = Readonly<{
  toastrDisplay: ProjectToastrDisplayType
  byId: Readonly<Record<string, ProjectType>> | null;
}>;

const initialState: ProjectsState = { toastrDisplay: '', byId: null };

const getAllMembersExceptTargetMember = (project: ProjectType, targetMemberId: string) => {
  return project.projectMembers.filter((member: ProjectMember) => {
    return member.id !== targetMemberId;
  });
}

const getAllMembersWithUpdatedAdminStatusForTargetMember = (project: ProjectType, targetMemberId: string, isAdmin: boolean) => {
  return project.projectMembers.map((member: ProjectMember) => {
    if(member.id !== targetMemberId) {
      return member;
    };

    return {...member, isAdmin}
  });
}

const reducer = (state: ProjectsState = initialState, action: AnyAction) => {
  const typedAction = action as ProjectsAction;
  switch (typedAction.type) {
    case getType(setProjectToastrDisplay):
      return {
        ...state,
        toastrDisplay: typedAction.payload.toastrDisplay,
      };
    case getType(fetchProjectsRequest):
      return {
        ...state,
        byId: null,
      };
    case getType(fetchProjectSuccess):
      return {
        ...state,
        byId: {
          ...state.byId,
          ...typedAction.payload.byId,
        },
      };
    case getType(addMemberToProjectSuccess):
      return {
        ...state,
        byId: {
          ...state.byId,
          ...typedAction.payload.byId,
        },
      };
    case getType(deleteMemberOfProjectSuccess):
      if(!state.byId) { return state };

      return {
        ...state,
        byId: {
          ...state.byId,
          [typedAction.payload.projectId]: {
            ...state.byId[typedAction.payload.projectId],
            projectMembers: getAllMembersExceptTargetMember(state.byId[typedAction.payload.projectId], typedAction.payload.userId),
          }
        },
      };
      case getType(editMemberOfProjectSuccess):
        if(!state.byId) { return state };
  
        const updatedMembers = getAllMembersWithUpdatedAdminStatusForTargetMember(
          state.byId[typedAction.payload.projectId],
          typedAction.payload.userId,
          typedAction.payload.isAdmin
        );

        return {
          ...state,
          byId: {
            ...state.byId,
            [typedAction.payload.projectId]: {
              ...state.byId[typedAction.payload.projectId],
              projectMembers: updatedMembers
            }
          },
        };
    case getType(fetchProjectError):
      return {
        ...state,
        byId: {
          ...state.byId,
          ...(
            typedAction.payload.projectId && { [typedAction.payload.projectId]: null }
          ),
        },
      };
    default:
      return state;
  }
};

export default reducer;
