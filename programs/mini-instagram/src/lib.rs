use anchor_lang::prelude::*;

declare_id!("CSSiDf2hnmct2dCz9zb6ZjS4pnwQHXSP28dYJCL5QKjH");

#[program]
pub mod mini_instagram {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Mini Instagram Iniciado!");
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
        let post = &mut ctx.accounts.post;
        post.author = *ctx.accounts.author.key;
        post.content = content.clone();

        msg!("Nuevo post creado por: {}", post.author);
        msg!("Contenido: {}", post.content);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(content: String)] // ✅ necesario para usar el content como seed
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = author,
        space = 8 + 32 + 4 + 280,
        seeds = [b"post", author.key().as_ref(), content.as_bytes()],
        bump
    )]
    pub post: Account<'info, PostAccount>,

    #[account(mut)]
    pub author: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct PostAccount {
    pub author: Pubkey,
    pub content: String,
}
