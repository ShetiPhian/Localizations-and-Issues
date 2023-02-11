package shetiphian.patch.sodium.biomeblending;

import com.google.common.collect.Sets;
import net.minecraft.block.Block;
import net.minecraft.block.Blocks;
import net.minecraft.fluid.Fluid;
import net.minecraft.fluid.Fluids;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.tag.TagKey;
import net.minecraft.util.Identifier;

import java.util.Set;

public class BlendingLookup
{
	private static final TagKey<Block> TAG_BLENDABLE_BLOCKS = TagKey.of(RegistryKeys.BLOCK, new Identifier("c", "blendable"));
	private static final TagKey<Fluid> TAG_BLENDABLE_FLUIDS = TagKey.of(RegistryKeys.FLUID, new Identifier("c", "blendable"));

	private static final Set<Block> DEFAULT_BLOCKS = Sets.newHashSet(
		Blocks.FERN, Blocks.LARGE_FERN, Blocks.POTTED_FERN, Blocks.GRASS, Blocks.TALL_GRASS,
		Blocks.GRASS_BLOCK, Blocks.OAK_LEAVES, Blocks.JUNGLE_LEAVES, Blocks.ACACIA_LEAVES, Blocks.DARK_OAK_LEAVES,
		Blocks.MANGROVE_LEAVES, Blocks.AZALEA_LEAVES, Blocks.BIRCH_LEAVES, Blocks.FLOWERING_AZALEA_LEAVES,
		Blocks.VINE, Blocks.WATER, Blocks.BUBBLE_COLUMN, Blocks.WATER_CAULDRON, Blocks.SUGAR_CANE);

	private static final Set<Fluid> DEFAULT_FLUIDS = Sets.newHashSet(
		Fluids.EMPTY, Fluids.WATER, Fluids.FLOWING_WATER, Fluids.LAVA, Fluids.FLOWING_LAVA);

	public static boolean shouldBlend(Block block)
	{
		return DEFAULT_BLOCKS.contains(block) || block.getDefaultState().isIn(TAG_BLENDABLE_BLOCKS);
	}

	public static boolean shouldBlend(Fluid fluid)
	{
		return DEFAULT_FLUIDS.contains(fluid) || fluid.getDefaultState().isIn(TAG_BLENDABLE_FLUIDS);
	}
}