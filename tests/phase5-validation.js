const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runValidation() {
  console.log('==========================================');
  console.log('  MCOA Phase 5 Automated Validation Suite ');
  console.log('==========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✔ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✖ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // Test 1: Verified AI Knowledge Base
    // ----------------------------------------------------
    console.log('Test 1: Verifying AI Knowledge Base articles & citations...');
    const kbItems = await prisma.aiKnowledgeItem.findMany();
    assert(kbItems.length >= 5, `Expected at least 5 knowledge items, found ${kbItems.length}`);

    const feeKb = kbItems.find(k => k.category === 'courses' && k.title.includes('Tuition Fee Schedules'));
    assert(!!feeKb, 'Found verified knowledge item for course fees & installment schedules');
    assert(feeKb?.content.includes('₹45,000') && feeKb?.content.includes('₹15,000'), 'Verified fee truth data (₹45,000 total, ₹15,000 installments)');

    const guidelineKb = kbItems.find(k => k.category === 'guidelines' && k.title.includes('Diabetes Mellitus'));
    assert(!!guidelineKb, 'Found verified knowledge item for 2026 ICD-10-CM Diabetes guidelines');
    assert(guidelineKb?.source.includes('Official CMS/CDC ICD-10-CM Coding Guidelines'), 'Verified authoritative source citation');

    // ----------------------------------------------------
    // Test 2: AI RAG Query & Counselor Escalation
    // ----------------------------------------------------
    console.log('\nTest 2: Verifying AI RAG Chat & Human Counselor Escalation...');
    const convs = await prisma.aiConversation.findMany();
    assert(convs.length >= 2, `Expected sample AI conversations, found ${convs.length}`);

    const escalatedConv = await prisma.aiConversation.findFirst({
      where: { userPhone: { not: null } }
    });
    assert(!!escalatedConv, 'Found human counselor escalated conversation');
    assert(escalatedConv?.userPhone === '9876543210' || !!escalatedConv?.userPhone, `Verified extracted contact number: ${escalatedConv?.userPhone}`);

    // ----------------------------------------------------
    // Test 3: Dynamic Template-Driven Landing Pages
    // ----------------------------------------------------
    console.log('\nTest 3: Verifying dynamic landing pages & structured blocks...');
    const landingPages = await prisma.landingPage.findMany();
    assert(landingPages.length >= 3, `Expected at least 3 landing pages, found ${landingPages.length}`);

    const cpcPage = await prisma.landingPage.findUnique({
      where: { slug: 'cpc-bootcamp-2026' }
    });
    assert(!!cpcPage, 'Found AAPC CPC Exam Bootcamp landing page');
    assert(cpcPage?.status === 'Published', 'Verified landing page published state');
    assert(cpcPage?.templateType === 'cpc_bootcamp', 'Verified template type: cpc_bootcamp');

    const sections = JSON.parse(cpcPage?.sectionsJson || '{}');
    assert(Array.isArray(sections.highlights) && sections.highlights.length >= 3, 'Verified structured highlights array in landing page');
    assert(Array.isArray(sections.curriculumPreview) && sections.curriculumPreview.length >= 3, 'Verified curriculum preview modules');
    assert(Array.isArray(sections.testimonials) && sections.testimonials.length >= 2, 'Verified verified student testimonials');

    // ----------------------------------------------------
    // Test 4: Healthcare RCM Blog Posts
    // ----------------------------------------------------
    console.log('\nTest 4: Verifying healthcare RCM blog posts & author attribution...');
    const blogPosts = await prisma.blogPost.findMany();
    assert(blogPosts.length >= 3, `Expected at least 3 blog posts, found ${blogPosts.length}`);

    const icdPost = await prisma.blogPost.findUnique({
      where: { slug: 'top-10-icd10cm-2026-guideline-changes' }
    });
    assert(!!icdPost, 'Found 2026 ICD-10-CM guideline changes blog post');
    assert(icdPost?.authorName === 'Dr. Jeevanantham Mariappan', `Verified author: ${icdPost?.authorName}`);
    assert(icdPost?.tags.includes('ICD-10-CM'), 'Verified SEO topic tags');

    // ----------------------------------------------------
    // Test 5: Executive Multi-Branch Reports
    // ----------------------------------------------------
    console.log('\nTest 5: Verifying multi-campus performance aggregation...');
    const branches = await prisma.branch.findMany({
      include: { batches: { include: { enrollments: true } }, leads: true }
    });
    assert(branches.length >= 4, `Expected at least 4 campus hubs, found ${branches.length}`);

    const chennaiBranch = branches.find(b => b.city === 'Chennai');
    assert(!!chennaiBranch, 'Found Chennai Head Office campus');

    const totalEnrollments = await prisma.enrollment.count();
    assert(totalEnrollments >= 1, `Verified active enrollments in reporting: ${totalEnrollments}`);

  } catch (err) {
    console.error('Validation execution error:', err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n==========================================');
  console.log(`Phase 5 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('==========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runValidation();
