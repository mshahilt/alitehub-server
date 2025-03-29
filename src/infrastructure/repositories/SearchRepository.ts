import { ISearchRepository } from "../../application/interface/ISearchRepository";
import { SearchResults, RecentSearch } from "../../application/interface/ISearchRepository";
import UserModel from "../database/models/UserModel";
import PostModel from "../database/models/PostModel";
import JobModel from "../database/models/JobModel";
import CompanyModel from "../database/models/CompanyModel";
import { RecentSeachModel } from "../database/models/RecentSearchModel";
import { User } from "../../domain/entities/User";
import { Post } from "../../domain/entities/Post";
import { Job } from "../../domain/entities/Job";
import { Company } from "../../domain/entities/Company";


export class SearchRepositoryImpl implements ISearchRepository {
    async search(query: string, filter: string): Promise<SearchResults> {
       const regex = new RegExp(query, 'i');
       const results: SearchResults = {
        users: [],
        posts: [],
        jobs: [],
        companies: []
        };

        if (filter === 'users' || filter === 'all') {
            const users = await UserModel.find({ $or: [{ name: regex }, { email: regex }] }).limit(10);
            results.users = users.map(user => new User({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                username: user.username,
                profile_picture: user.profile_picture
            }));
        }

        if (filter === 'posts' || filter === 'all') {
            const posts = await PostModel.find({ $or: [{ title: regex }, { description: regex }] }).limit(10);
            results.posts = posts.map(post => new Post({
                id: post.id.toString(),
                title: post.title,
                description: post.description,
                media: post.media,
                tags: post.tags,
                time: post.time
            }));
        }

        if (filter === 'jobs' || filter === 'all') {
            const jobs = await JobModel.find({ $or: [{ title: regex }, { description: regex }] }).limit(10);
            results.jobs = jobs.map(job => new Job({
                id: job.id.toString(),
                jobTitle: job.jobTitle,
                description: job.description,
                company: job.companyName,
                jobLocation: job.jobLocation,
                jobType: job.jobType,
                skills: job.skills,
                postedDate: job.postedDate
            }));
        }

        if (filter === 'companies' || filter === 'all') {
            const companies = await CompanyModel.find({ $or: [{ name: regex }, { description: regex }] }).limit(10);
            results.companies = companies.map(company => new Company({
                id: company.id,
                name: company.name,
                locations: company.locations,
                industry: company.industry,
                profile_picture: company.profile_picture
            }))
        }

        return results;
    }

    async getRecentSearches(userId: string): Promise<RecentSearch[]> {
        return await RecentSeachModel.find({ userId });
    }

    async saveRecentSearch(userId: string, query: string, filter: string): Promise<void> {
        await RecentSeachModel.create({
            userId,
            search: { query, filter }
        });
    }

    async deleteAllRecentSearches(userId: string): Promise<void> {
        await RecentSeachModel.deleteMany({ userId });
    }

    async getExplorePosts(): Promise<any[]> {
        return await PostModel.find().sort({ createdAt: -1 }).limit(10);
    }
}