package shetiphian.patch.sodium.biomeblending.mixin;

import me.jellysquid.mods.sodium.client.model.quad.ModelQuadView;
import me.jellysquid.mods.sodium.client.model.quad.blender.ColorSampler;
import me.jellysquid.mods.sodium.client.model.quad.blender.LinearColorBlender;
import me.jellysquid.mods.sodium.client.util.color.ColorARGB;
import net.minecraft.block.BlockState;
import net.minecraft.fluid.FluidState;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.BlockRenderView;
import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;
import shetiphian.patch.sodium.biomeblending.BlendingLookup;

@Mixin(LinearColorBlender.class)
public abstract class Mixin_LinearColorBlender
{
	@Shadow
	@Final
	private int[] cachedRet;

	@Inject(method = "getColors", at = @At("HEAD"), cancellable = true)
	private <T> void init(BlockRenderView world, BlockPos origin, ModelQuadView quad, ColorSampler<T> sampler, T state, CallbackInfoReturnable<int[]> cir)
	{
		boolean blend = true;
		if (state instanceof BlockState blockState) {
			blend = BlendingLookup.shouldBlend(blockState.getBlock());
		} else if (state instanceof FluidState fluidState) {
			blend = BlendingLookup.shouldBlend(fluidState.getFluid());
		}
		if (!blend) {
			int[] colors = this.cachedRet;
			for (int vertexIndex = 0; vertexIndex < 4; ++vertexIndex) {
				colors[vertexIndex] = ColorARGB.toABGR(sampler.getColor(state, world, origin, quad.getColorIndex()));
			}
			cir.setReturnValue(colors);
			cir.cancel();
		}
	}
}