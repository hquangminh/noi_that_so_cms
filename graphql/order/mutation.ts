import { gql } from '@apollo/client';

export const API_UpdateOrderStatus = gql`
  mutation UpdateOrderStatus($orderID: Int!, $status: Int!, $log: order_log_insert_input!) {
    update_order(where: { id: { _eq: $orderID } }, _set: { status: $status }) {
      affected_rows
      returning {
        status
      }
    }

    insert_order_log_one(object: $log) {
      type
      created_at
    }
  }
`;

export const API_AddOrderNote = gql`
  mutation AddOrderNote($data: order_note_insert_input!) {
    insert_order_note_one(object: $data) {
      id
      note
      created_at
      updated_at
    }
  }
`;

export const API_EditOrderNote = gql`
  mutation EditOrderNote($note: String!, $id: Int!) {
    update_order_note(where: { id: { _eq: $id } }, _set: { note: $note }) {
      returning {
        id
        note
        created_at
        updated_at
      }
    }
  }
`;
