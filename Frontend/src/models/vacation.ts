  interface Vacation {
    v_id: number
    description: string
    destination: string
    //path
    image: string
    start_date: any
    end_date: any
    price: number
    likes: number
    is_liked: boolean
    id?: number
    user_id: number
    //actual image
    actual_image: string
  }

  export default Vacation