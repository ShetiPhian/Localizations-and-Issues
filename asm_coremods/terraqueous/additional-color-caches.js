/**
 * Summery:
 * Injects a handler into ClientWorld.getBlockColor, which creates a new ColorCache and enables added ColorResolvers to be used.
 *
 * Why is this needed?
 * To tint a block you must register a IBlockColor, (which works as is for non-biome based tinting and if tinting with vanilla color maps)
 * IBlockColor uses ILightReader which does not have access to the biome data. So you can't run the calculations yourself, and must use ILightReader.getBlockColor
 * ILightReader.getBlockColor requires a ColorResolver. While you can create a ColorResolver, ClientWorld.getBlockColor checks its colorCaches and causes a crash if the ColorResolver is not in it.
 * There is no way to add a ColorResolver to the cache list, it is hard coded to the vanilla color maps
 */

function initializeCoreMod() {
    Opcodes = Java.type("org.objectweb.asm.Opcodes");
    ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
    InsnList = Java.type("org.objectweb.asm.tree.InsnList");
    Label = Java.type("org.objectweb.asm.Label");
    LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
    VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
    FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
    MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
    JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
    TypeInsnNode = Java.type("org.objectweb.asm.tree.TypeInsnNode");
    InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
    FrameNode = Java.type("org.objectweb.asm.tree.FrameNode");

    return {
        "ClientWorld.getBlockColor": {
            "target": {
                "type": "METHOD",
                "class": "net.minecraft.client.world.ClientWorld",
                "methodName": ASMAPI.mapMethod("func_225525_a_"), // getBlockColor
                "methodDesc": "(Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/world/level/ColorResolver;)I"
            },
            "transformer": function(methodNode) {
                print("Starting Transform: Terraqueous/additional-color-caches.js 'ClientWorld.getBlockColor'");

                var colorCaches = ASMAPI.mapField("field_228315_B_");

                var toInject = new InsnList();
                var labelStart = new Label();
                toInject.add(new LabelNode(labelStart));
                toInject.add(new VarInsnNode(Opcodes.ALOAD, 0));
                toInject.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/client/world/ClientWorld", colorCaches, "Lit/unimi/dsi/fastutil/objects/Object2ObjectArrayMap;"));
                toInject.add(new VarInsnNode(Opcodes.ALOAD, 2));
                toInject.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, "it/unimi/dsi/fastutil/objects/Object2ObjectArrayMap", "containsKey", "(Ljava/lang/Object;)Z", false));
                var labelNodeEnd = new LabelNode(new Label());
                toInject.add(new JumpInsnNode(Opcodes.IFNE, labelNodeEnd));
                var labelIfBlock = new Label();
                toInject.add(new LabelNode(labelIfBlock));
                toInject.add(new VarInsnNode(Opcodes.ALOAD, 0));
                toInject.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/client/world/ClientWorld", colorCaches, "Lit/unimi/dsi/fastutil/objects/Object2ObjectArrayMap;"));
                toInject.add(new VarInsnNode(Opcodes.ALOAD, 2));
                toInject.add(new TypeInsnNode(Opcodes.NEW, "net/minecraft/client/renderer/color/ColorCache"));
                toInject.add(new InsnNode(Opcodes.DUP));
                toInject.add(new MethodInsnNode(Opcodes.INVOKESPECIAL, "net/minecraft/client/renderer/color/ColorCache", "<init>", "()V", false));
                toInject.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, "it/unimi/dsi/fastutil/objects/Object2ObjectArrayMap", "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;", false));
                toInject.add(new InsnNode(Opcodes.POP));
                toInject.add(labelNodeEnd);
                toInject.add(new FrameNode(Opcodes.F_SAME, 0, null, 0, null));

                var instructions = methodNode.instructions;
                instructions.insert(instructions.get(0), toInject);
                print("Instructions Injected");
                return methodNode;
            }
        }
    };
}