import post1Img from '../assets/images/post1.png';
import post2Img from '../assets/images/post2.png';
import post3Img from '../assets/images/post3.jpg';
import post1Content from '../assets/contents/post-1.txt';
import post2Content from '../assets/contents/post-2.txt';
import post3Content from '../assets/contents/post-3.txt';

export interface Post {
  id: number;
  image: string;
  content: string;
  link: string;
}

export const posts: Post[] = [
  {
    id: 1,
    image: post1Img,
    content: await fetch(post1Content).then((res) => res.text()),
    link: 'https://www.facebook.com/share/p/18Tv868WLx/',
  },
  {
    id: 2,
    image: post2Img,
    content: await fetch(post2Content).then((res) => res.text()),
    link: 'https://www.facebook.com/share/p/185uejw8h3/',
  },
  {
    id: 3,
    image: post3Img,
    content: await fetch(post3Content).then((res) => res.text()),
    link: 'https://www.facebook.com/share/p/1QfrtrhPGR/',
  },
];
