import { ObjectId } from 'mongodb';
import type { TDatabase } from '../database/mongoDB';

const firstId = new ObjectId();
const secondId = new ObjectId();
const thirdId = new ObjectId();
const fourthId = new ObjectId();

export const blogs: TDatabase.TBlog[] = [
    {
        _id: firstId,
        name: 'Eco Lifestyle',
        description:
            'Eco Lifestyle is dedicated to sustainable living and environmental awareness. Discover practical tips on green living, eco-friendly products, and guides to help reduce your carbon footprint and live more consciously.',
        websiteUrl: 'https://ecolifestyle.com',
        createdAt: '2024-11-15T10:50:15.222Z',
        isMembership: false,
    },
    {
        _id: secondId,
        name: 'Tech Trends',
        description:
            'Tech Trends offers the latest insights into technological advancements and digital innovations. Stay updated with the newest trends in AI, gadgets, software, and industry changes, all explained in a simple and engaging manner.',
        websiteUrl: 'https://techtrends.io',
        createdAt: '2024-11-17T10:50:15.222Z',
        isMembership: false,
    },
    {
        _id: thirdId,
        name: 'Wellness Path',
        description:
            'Wellness Path is a resource for those seeking a healthier lifestyle. From mindfulness techniques to nutritional guidance, our blog covers every aspect of physical and mental wellness for a balanced, healthier life.',
        websiteUrl: 'https://wellnesspath.org',
        createdAt: '2024-11-19T10:50:15.222Z',
        isMembership: false,
    },
    {
        _id: fourthId,
        name: 'Creative Minds',
        description:
            'Creative Minds celebrates art, design, and creativity. With interviews, tutorials, and inspiration from artists worldwide, our blog is a hub for those looking to boost their creative journey and discover new art forms.',
        websiteUrl: 'https://creativeminds.art',
        createdAt: '2024-11-22T10:50:15.222Z',
        isMembership: false,
    },
];

export const posts: TDatabase.TPost[] = [
    {
        _id: new ObjectId(),
        title: 'Easy Green Home Tips',
        shortDescription: 'Simple steps to make your home more eco-friendly.',
        content:
            "Transforming your home to be more sustainable doesn't have to be hard. Start by reducing plastic, recycling properly, and using energy-efficient appliances. Discover easy swaps that make a big impact on the environment and save you money.",
        blogId: firstId.toString(),
        blogName: 'Eco Lifestyle',
        createdAt: '2024-12-28T10:50:15.222Z',
    },
    {
        _id: new ObjectId(),
        title: 'Top 5 Eco Products',
        shortDescription: 'Our top picks for sustainable everyday products.',
        content:
            "From reusable water bottles to eco-friendly cleaning supplies, we've rounded up five essential products that make sustainable living easier. Learn about their benefits and where to find them, so you can reduce waste and promote greener practices.",
        blogId: firstId.toString(),
        blogName: 'Eco Lifestyle',
        createdAt: '2024-12-22T10:50:15.222Z',
    },
    {
        _id: new ObjectId(),
        title: 'Latest AI Innovations',
        shortDescription: 'Discover the most exciting AI breakthroughs of 2023.',
        content:
            'Artificial intelligence is advancing faster than ever, with recent innovations in natural language processing, image recognition, and autonomous systems. Learn how these breakthroughs are shaping industries and everyday life, and what to expect in the near future.',
        blogId: secondId.toString(),
        blogName: 'Tech Trends',
        createdAt: '2024-12-27T10:50:15.222Z',
    },
    {
        _id: new ObjectId(),
        title: 'Gadgets You Need in 2024',
        shortDescription: 'Must-have tech gadgets for the new year.',
        content:
            'Stay ahead of the curve with the latest in smart home tech, wearable devices, and innovative tools designed to make life easier. This list covers cutting-edge gadgets that bring functionality, style, and convenience to your daily routine.',
        blogId: secondId.toString(),
        blogName: 'Tech Trends',
        createdAt: '2024-12-22T10:50:15.222Z',
    },
    {
        _id: new ObjectId(),
        title: 'Mindfulness for Beginners',
        shortDescription: 'A simple guide to starting mindfulness.',
        content:
            "Mindfulness is a powerful tool for reducing stress and increasing focus. This beginner's guide covers basic mindfulness techniques, from breathing exercises to guided meditation, that can help bring calmness and clarity to your day-to-day life.",
        blogId: thirdId.toString(),
        blogName: 'Wellness Path',
        createdAt: '2024-12-26T10:50:15.222Z',
    },
    {
        _id: new ObjectId(),
        title: '10 Healthy Snacks',
        shortDescription: 'Quick and nutritious snack ideas for a busy day.',
        content:
            "Finding healthy snacks can be a challenge, but it doesn't have to be. Try these 10 easy snack ideas that are packed with nutrients, easy to prepare, and perfect for a quick energy boost without compromising your health goals.",
        blogId: thirdId.toString(),
        blogName: 'Wellness Path',
        createdAt: '2024-12-22T10:50:15.222Z',
    },
    {
        _id: new ObjectId(),
        title: 'Art Therapy for Stress',
        shortDescription: 'How art can reduce stress and improve well-being.',
        content:
            'Engaging in creative activities has been shown to relieve stress and enhance mental health. Explore various art therapy techniques such as drawing, painting, and coloring, and learn how these can be integrated into your daily routine for a calmer mind.',
        blogId: fourthId.toString(),
        blogName: 'Creative Minds',
        createdAt: '2024-12-25T10:50:15.222Z',
    },
    {
        _id: new ObjectId(),
        title: 'Tips for New Artists',
        shortDescription: 'Advice for those starting their artistic journey.',
        content:
            'Starting as an artist can be both exciting and challenging. Discover essential tips, from finding your style to practicing regularly, to help build your skills and confidence as you dive into the world of art.',
        blogId: fourthId.toString(),
        blogName: 'Creative Minds',
        createdAt: '2024-12-22T10:50:15.222Z',
    },
];

export const users: TDatabase.TUser[] = [
    {
        _id: firstId,
        login: 'george',
        email: 'user1george@example.com',
        passwordHash: '$2b$10$p6Hm7G2gx2ccIxXAq1krP.si7hZoQhfI22R77ux1CVG3v7osD8/hW',
        passwordSalt: '$2b$10$p6Hm7G2gx2ccIxXAq1krP.',
        createdAt: '2024-12-22T10:50:15.222Z',
    },
    {
        _id: secondId,
        login: 'natasha',
        email: 'user2natasha@example.com',
        passwordHash: '$2b$10$jpuk3Bw2dDMLKlPBtUvRZe7nD4Ru0RlRV9o36TNULHI5twYC15gDO',
        passwordSalt: '$2b$10$jpuk3Bw2dDMLKlPBtUvRZe',
        createdAt: '2024-12-10T10:50:15.222Z',
    },
    {
        _id: thirdId,
        login: 'vlad',
        email: 'user3vlad@example.com',
        passwordHash: '$2b$10$69rufEoYDA2GxsHN6l6gLOz4MNJHLofc0w5dFLtx9jXwsZ0zgQI8a',
        passwordSalt: '$2b$10$69rufEoYDA2GxsHN6l6gLO',
        createdAt: '2024-12-15T10:50:15.222Z',
    },
    {
        _id: fourthId,
        login: 'kate',
        email: 'user4kate@example.com',
        passwordHash: '$2b$10$oW7wbnms9GzvDrNXBUcZWO7ykmcFbOaQ9aeK2VSGO6ZM9Q9DYAe8q',
        passwordSalt: '$2b$10$oW7wbnms9GzvDrNXBUcZWO',
        createdAt: '2024-12-20T10:50:15.222Z',
    },
];

export const longDescription =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nisi commodo, blandit dolor et, pulvinar nibh. Proin eu euismod odio. Nullam elementum erat ullamcorper odio gravida feugiat. Mauris lorem ipsum, efficitur vel dui at, ultricies commodo metus. Phasellus dignissim quam ac porttitor porttitor. Etiam ut pharetra ligula. Duis a tempor sem. Mauris sit amet porttitor metus. Aenean convallis dui a nunc lobortis mattis. Aenean nec imperdiet justo. Donec eu ipsum eu enim sagittis viverra ac nec elit. In id bibendum velit. Pellentesque in ullamcorper lectus, ut efficitur libero.';

export const longWebsiteUrl =
    'https://ecolifestyleecolifestyleecolifestyleecolifestyleecolifestylecolifestylecolifestylecolifestyle.com';

export const longTitle =
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...';

export const longShortDescription =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed venenatis et felis id suscipit. Quisque eleifend congue felis a sodales.';

export const longContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget rhoncus lectus. Nullam eu condimentum arcu, id laoreet dui. Suspendisse finibus placerat lorem sed volutpat. Proin nisi libero, ullamcorper vel ornare at, lobortis non mi. Donec porttitor magna turpis, cursus pellentesque neque pretium lobortis. Vestibulum imperdiet tellus porta, tempor nulla ut, volutpat dui. Pellentesque vitae blandit sapien. Cras vel pulvinar tortor. Duis id velit sapien. Maecenas gravida metus magna, vel iaculis augue bibendum iaculis. Nunc euismod vestibulum eros, sit amet vestibulum nibh tincidunt sed. Vestibulum hendrerit, velit pharetra pharetra gravida, augue ligula semper orci, finibus ornare magna ex pellentesque velit. Maecenas gravida metus magna, vel iaculis augue bibendum iaculis. Nunc euismod vestibulum eros, sit amet vestibulum nibh tincidunt sed. Vestibulum hendrerit, velit pharetra pharetra gravida, augue ligula semper orci, finibus ornare magna ex pellentesque velit. finibus ornare magna ex pellentesque velit.';

export const fakeRequestedObjectId = '673f665f87f76397b8e5ce8e';
