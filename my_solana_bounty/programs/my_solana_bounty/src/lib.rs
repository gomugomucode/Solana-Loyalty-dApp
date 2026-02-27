use anchor_lang::prelude::*;

declare_id!("ZypDW9o9TSFYf2qvYueqLkAydmqgcqEg1bJ2bGAKsmR"); // We will fix this in a second

#[program]
pub mod my_solana_bounty {
    use super::*;

    // 1. Initialize a new user account to store points
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.points = 0;
        user_stats.bump = ctx.bumps.user_stats;
        msg!("User initialized with 0 points!");
        Ok(())
    }

    // 2. Add points (Only the admin/payer can do this)
    pub fn add_points(ctx: Context<UpdatePoints>, amount: u64) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.points += amount;
        msg!("Added {} points. New balance: {}", amount, user_stats.points);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init, 
        payer = signer, 
        space = 8 + 8 + 1, // 8 (discriminator) + 8 (u64 points) + 1 (bump)
        seeds = [b"user-stats", signer.key().as_ref()], 
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePoints<'info> {
    #[account(
        mut,
        seeds = [b"user-stats", signer.key().as_ref()],
        bump = user_stats.bump,
    )]
    pub user_stats: Account<'info, UserStats>,
    pub signer: Signer<'info>,
}

#[account]
pub struct UserStats {
    pub points: u64,
    pub bump: u8,
}